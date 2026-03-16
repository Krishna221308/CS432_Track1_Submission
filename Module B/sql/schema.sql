-- =============================================================================
-- FreshWash Laundry Management System
-- PostgreSQL Schema  |  CS 432 Databases – Assignment 2
-- Converted from MySQL 8.0 → PostgreSQL 15+
--
-- Author  : [Your Name / Roll Number]
-- Date    : 2026-03-16
-- Database: freshwashdb
-- Schema  : freshwash
-- =============================================================================


-- =============================================================================
-- SECTION 0: DATABASE-LEVEL SETUP
-- Run this block as a superuser BEFORE loading the rest of this file.
-- =============================================================================
-- CREATE DATABASE freshwashdb
--     ENCODING    = 'UTF8'
--     LC_COLLATE  = 'en_US.UTF-8'
--     LC_CTYPE    = 'en_US.UTF-8'
--     TEMPLATE    = template0;
-- \c freshwashdb
-- =============================================================================

-- Enable UUID generation (required for session tokens)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Custom application schema – keeps all objects neatly namespaced
CREATE SCHEMA IF NOT EXISTS freshwash;

-- Make freshwash the default search path for this session
SET search_path TO freshwash, public;


-- =============================================================================
-- SECTION 1: RBAC – ROLES & USERS
-- Independent master tables; no external FK dependencies.
-- =============================================================================

-- 1a. Roles  ---------------------------------------------------------------
-- Defines access levels: 'Admin' and 'Regular User'
CREATE TABLE freshwash.roles (
    role_id     SERIAL          PRIMARY KEY,
    role_name   VARCHAR(50)     NOT NULL UNIQUE,
    description VARCHAR(255),

    CONSTRAINT chk_roles_name CHECK (role_name IN ('Admin', 'Regular User'))
);

COMMENT ON TABLE  freshwash.roles IS 'RBAC: application-level access roles.';
COMMENT ON COLUMN freshwash.roles.role_name IS 'Allowed values: Admin | Regular User';

-- Seed default roles
INSERT INTO freshwash.roles (role_id, role_name, description) VALUES
    (1, 'Admin',        'Full access to all system features and data.'),
    (2, 'Regular User', 'Limited access: view own orders and profile only.');


-- 1b. Users  ---------------------------------------------------------------
-- Stores application login credentials linked to a role.
CREATE TABLE freshwash.users (
    user_id         SERIAL          PRIMARY KEY,
    username        VARCHAR(100)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,           -- bcrypt / Argon2 hash; never plain-text
    role_id         INT             NOT NULL,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at   TIMESTAMPTZ,
    member_id       INT,
    employee_id     INT,

    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id) REFERENCES freshwash.roles (role_id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_users_member
        FOREIGN KEY (member_id) REFERENCES freshwash.member (member_id)
        ON DELETE SET NULL,
    CONSTRAINT fk_users_employee
        FOREIGN KEY (employee_id) REFERENCES freshwash.employee (employee_id)
        ON DELETE SET NULL
);

COMMENT ON TABLE  freshwash.users IS 'Application user accounts with hashed passwords and RBAC role assignment.';
COMMENT ON COLUMN freshwash.users.password_hash IS 'Store only bcrypt/Argon2 hashes – NEVER plain text passwords.';

-- Index: fast lookup by username at login
CREATE INDEX idx_users_username ON freshwash.users (username);

-- Seed sample users (passwords are SHA-256 placeholders – replace in production)
INSERT INTO freshwash.users (user_id, username, password_hash, role_id) VALUES
    (1, 'admin',         'nimda', 1),
    (2, 'aarav.patel',   '$2b$12$userHashPlaceholderAarav00000000000000000000000000000', 2),
    (3, 'vivaan.singh',  '$2b$12$userHashPlaceholderVivaan0000000000000000000000000000', 2);


-- =============================================================================
-- SECTION 2: CORE LAUNDRY MASTER TABLES
-- Independent tables that other entities reference.
-- =============================================================================

-- 2a. Clothing Type  -------------------------------------------------------
CREATE TABLE freshwash.clothing_type (
    type_id          SERIAL         PRIMARY KEY,
    type_name        VARCHAR(50)    NOT NULL,
    wash_instruction VARCHAR(255)   NOT NULL
);

COMMENT ON TABLE freshwash.clothing_type IS 'Lookup table for garment categories and their care instructions.';

INSERT INTO freshwash.clothing_type (type_id, type_name, wash_instruction) VALUES
    (1,  'Cotton Shirt',    'Cold water, tumble dry low'),
    (2,  'Silk Saree',      'Dry clean only'),
    (3,  'Denim Jeans',     'Warm wash, inside out'),
    (4,  'Woolen Sweater',  'Hand wash cold, flat dry'),
    (5,  'Bed Sheet',       'Hot wash, high heat dry'),
    (6,  'Linen Trousers',  'Cold wash, air dry'),
    (7,  'Suit Jacket',     'Dry clean only'),
    (8,  'Curtains',        'Gentle cycle, hang dry'),
    (9,  'Bath Towel',      'Hot wash, tumble dry high'),
    (10, 'Silk Scarf',      'Hand wash cold');


-- 2b. Service  -------------------------------------------------------------
CREATE TABLE freshwash.service (
    service_id          SERIAL          PRIMARY KEY,
    service_name        VARCHAR(50)     NOT NULL UNIQUE,
    service_description VARCHAR(255)    NOT NULL,
    base_price          NUMERIC(10, 2)  NOT NULL,

    -- MySQL: service_chk_1
    CONSTRAINT chk_service_base_price CHECK (base_price > 0)
);

COMMENT ON TABLE freshwash.service IS 'Catalogue of laundry service offerings with base pricing.';

INSERT INTO freshwash.service (service_id, service_name, service_description, base_price) VALUES
    (1,  'Wash & Fold',      'Standard machine wash and folding service',                50.00),
    (2,  'Dry Cleaning',     'Chemical cleaning for delicate fabrics',                  150.00),
    (3,  'Steam Ironing',    'Professional steam pressing',                              30.00),
    (4,  'Stain Removal',    'Intensive chemical stain treatment',                       80.00),
    (5,  'Express Delivery', 'Same day washing and delivery',                           100.00),
    (6,  'Premium Wash',     'Eco-friendly detergent and fabric softeners',              70.00),
    (7,  'Shoe Cleaning',    'Deep cleaning and deodorizing of footwear',               120.00),
    (8,  'Curtain Washing',  'Specialized washing for curtains and drapes',             200.00),
    (9,  'Blanket Cleaning', 'Heavy-duty washing for blankets and quilts',              180.00),
    (10, 'Leather Cleaning', 'Professional care for leather garments',                  250.00);


-- 2c. Employee  ------------------------------------------------------------
CREATE TABLE freshwash.employee (
    employee_id     SERIAL          PRIMARY KEY,
    employee_name   VARCHAR(100)    NOT NULL,
    role            VARCHAR(50)     NOT NULL,
    contact_number  VARCHAR(15)     NOT NULL,
    joining_date    DATE            NOT NULL
);

COMMENT ON TABLE freshwash.employee IS 'Staff records including role designation and contact info.';

INSERT INTO freshwash.employee (employee_id, employee_name, role, contact_number, joining_date) VALUES
    (1,  'Ramesh Kumar',        'Delivery Driver',      '9988776655', '2024-01-15'),
    (2,  'Suresh Yadav',        'Washer',               '9988776644', '2024-02-10'),
    (3,  'Anita Desai',         'Ironing Specialist',   '9988776633', '2024-03-05'),
    (4,  'Pooja Reddy',         'Manager',              '9988776622', '2023-11-20'),
    (5,  'Vikram Malhotra',     'Dry Cleaning Expert',  '9988776611', '2024-01-25'),
    (6,  'Rajesh Koothrappali', 'Driver',               '9988776600', '2024-04-01'),
    (7,  'Neha Sharma',         'Customer Support',     '9988776599', '2024-04-12'),
    (8,  'Amit Verma',          'Quality Checker',      '9988776588', '2024-05-03'),
    (9,  'Kavita Joshi',        'Accountant',           '9988776577', '2024-05-15'),
    (10, 'Rahul Mehta',         'Inventory Supervisor', '9988776566', '2024-06-01');


-- 2d. Member  --------------------------------------------------------------
-- MySQL: member_chk_1 → age >= 18
CREATE TABLE freshwash.member (
    member_id       SERIAL          PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    age             INT             NOT NULL,
    email           VARCHAR(100)    NOT NULL UNIQUE,
    contact_number  VARCHAR(15)     NOT NULL UNIQUE,
    address         VARCHAR(255)    NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_member_age CHECK (age >= 18)
);

COMMENT ON TABLE freshwash.member IS 'Registered customer accounts. Must be 18+ years old.';

-- Indexes: email and contact_number are common lookup / search fields
CREATE INDEX idx_member_email   ON freshwash.member (email);
CREATE INDEX idx_member_contact ON freshwash.member (contact_number);

INSERT INTO freshwash.member (member_id, name, age, email, contact_number, address, created_at) VALUES
    (1,  'Aarav Patel',    25, 'aarav.p@example.com',    '9876543210', '123 MG Road, Gandhinagar',        '2026-02-14 21:37:05+00'),
    (2,  'Vivaan Singh',   34, 'vivaan.s@example.com',   '9876543211', '456 Sector 11, Gandhinagar',      '2026-02-14 21:37:05+00'),
    (3,  'Diya Sharma',    22, 'diya.sharma@example.com','9876543212', '789 Campus Housing, IITGN',        '2026-02-14 21:37:05+00'),
    (4,  'Ananya Gupta',   29, 'ananya.g@example.com',   '9876543213', '321 Riverside Apt, Ahmedabad',    '2026-02-14 21:37:05+00'),
    (5,  'Rohan Mehta',    40, 'rohan.m@example.com',    '9876543214', '654 Paldi, Ahmedabad',             '2026-02-14 21:37:05+00'),
    (6,  'Ishita Verma',   27, 'ishita.v@example.com',   '9876543215', '12 Green Park, Gandhinagar',      '2026-02-14 21:37:05+00'),
    (7,  'Kabir Das',      31, 'kabir.d@example.com',    '9876543216', '88 Lake View, Ahmedabad',          '2026-02-14 21:37:05+00'),
    (8,  'Meera Iyer',     45, 'meera.i@example.com',    '9876543217', '99 Satellite Road, Ahmedabad',    '2026-02-14 21:37:05+00'),
    (9,  'Arjun Reddy',    23, 'arjun.r@example.com',    '9876543218', 'Hostel Block 4, IITGN',            '2026-02-14 21:37:05+00'),
    (10, 'Sanya Malhotra', 28, 'sanya.m@example.com',    '9876543219', '55 InfoCity, Gandhinagar',        '2026-02-14 21:37:05+00');


-- =============================================================================
-- SECTION 3: PRICING JUNCTION TABLE
-- Depends on: service, clothing_type
-- =============================================================================

-- 3a. Price  ---------------------------------------------------------------
-- Many-to-many: service × clothing_type → specific price point
-- MySQL: price_chk_1 → price > 0
CREATE TABLE freshwash.price (
    price_id    SERIAL          PRIMARY KEY,
    service_id  INT             NOT NULL,
    type_id     INT             NOT NULL,
    price       NUMERIC(10, 2)  NOT NULL,

    CONSTRAINT uq_price_service_type UNIQUE (service_id, type_id),
    CONSTRAINT chk_price_positive    CHECK  (price > 0),

    CONSTRAINT fk_price_service
        FOREIGN KEY (service_id) REFERENCES freshwash.service (service_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_price_type
        FOREIGN KEY (type_id) REFERENCES freshwash.clothing_type (type_id)
        ON DELETE CASCADE
);

COMMENT ON TABLE freshwash.price IS 'Per-item pricing matrix: service × clothing type combination.';

-- Indexes on FK columns (B-Tree, default)
CREATE INDEX idx_price_service_id ON freshwash.price (service_id);
CREATE INDEX idx_price_type_id    ON freshwash.price (type_id);

INSERT INTO freshwash.price (price_id, service_id, type_id, price) VALUES
    (1,  1, 1,  60.00),
    (2,  1, 3,  70.00),
    (3,  2, 2, 250.00),
    (4,  3, 1,  40.00),
    (5,  2, 4, 200.00),
    (6,  1, 5,  90.00),
    (7,  2, 7, 300.00),
    (8,  3, 6,  45.00),
    (9,  1, 9,  50.00),
    (10, 2, 10, 150.00);


-- =============================================================================
-- SECTION 4: TRANSACTIONAL TABLES
-- Depend on parent master tables (member, service, employee).
-- =============================================================================

-- 4a. Laundry Order  -------------------------------------------------------
-- MySQL: chk_delivery_time → expected_delivery_time > pickup_time
CREATE TABLE freshwash.laundry_order (
    order_id                SERIAL          PRIMARY KEY,
    member_id               INT             NOT NULL,
    order_date              TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    pickup_time             TIMESTAMPTZ     NOT NULL,
    expected_delivery_time  TIMESTAMPTZ     NOT NULL,
    total_amount            NUMERIC(10, 2)  NOT NULL DEFAULT 0.00,
    current_status          VARCHAR(50)     NOT NULL DEFAULT 'Pending',

    CONSTRAINT chk_delivery_time
        CHECK (expected_delivery_time > pickup_time),

    CONSTRAINT fk_laundry_order_member
        FOREIGN KEY (member_id) REFERENCES freshwash.member (member_id)
        ON DELETE CASCADE
);

COMMENT ON TABLE freshwash.laundry_order IS 'Core order entity linking a member to requested laundry services.';

-- Index on member_id (common JOIN column)
CREATE INDEX idx_laundry_order_member_id ON freshwash.laundry_order (member_id);

INSERT INTO freshwash.laundry_order
    (order_id, member_id, order_date, pickup_time, expected_delivery_time, total_amount, current_status)
VALUES
    (1,  1, '2026-02-14 21:37:05+00', '2026-02-01 09:00:00+00', '2026-02-03 18:00:00+00',  500.00, 'Processing'),
    (2,  2, '2026-02-14 21:37:05+00', '2026-02-02 10:00:00+00', '2026-02-04 12:00:00+00',  250.00, 'Pending'),
    (3,  3, '2026-02-14 21:37:05+00', '2026-02-02 14:00:00+00', '2026-02-05 10:00:00+00', 1000.00, 'Delivered'),
    (4,  4, '2026-02-14 21:37:05+00', '2026-02-03 08:30:00+00', '2026-02-04 17:00:00+00',  150.00, 'Picked Up'),
    (5,  5, '2026-02-14 21:37:05+00', '2026-02-03 11:00:00+00', '2026-02-06 09:00:00+00',  450.00, 'Processing'),
    (6,  6, '2026-02-14 21:37:05+00', '2026-02-04 09:15:00+00', '2026-02-06 18:00:00+00',  300.00, 'Washing'),
    (7,  7, '2026-02-14 21:37:05+00', '2026-02-04 10:30:00+00', '2026-02-05 14:00:00+00',  600.00, 'Ready for Delivery'),
    (8,  8, '2026-02-14 21:37:05+00', '2026-02-05 13:00:00+00', '2026-02-07 11:00:00+00',  200.00, 'Pending'),
    (9,  9, '2026-02-14 21:37:05+00', '2026-02-05 15:45:00+00', '2026-02-08 10:00:00+00',  120.00, 'Picked Up'),
    (10, 10,'2026-02-14 21:37:05+00', '2026-02-06 08:00:00+00', '2026-02-09 18:00:00+00',  800.00, 'Processing');


-- 4b. Order Service (line items)  ------------------------------------------
-- Junction: laundry_order × service
-- MySQL: order_service_chk_1 → quantity > 0
CREATE TABLE freshwash.order_service (
    order_service_id    SERIAL          PRIMARY KEY,
    order_id            INT             NOT NULL,
    service_id          INT             NOT NULL,
    quantity            INT             NOT NULL,
    applied_price       NUMERIC(10, 2)  NOT NULL,

    CONSTRAINT chk_order_service_qty CHECK (quantity > 0),

    CONSTRAINT fk_order_service_order
        FOREIGN KEY (order_id)   REFERENCES freshwash.laundry_order (order_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_order_service_service
        FOREIGN KEY (service_id) REFERENCES freshwash.service (service_id)
);

COMMENT ON TABLE freshwash.order_service IS 'Line items: which services were applied to a given order.';

CREATE INDEX idx_order_service_order_id   ON freshwash.order_service (order_id);
CREATE INDEX idx_order_service_service_id ON freshwash.order_service (service_id);

INSERT INTO freshwash.order_service (order_service_id, order_id, service_id, quantity, applied_price) VALUES
    (1,  1,  1, 5,  60.00),
    (2,  1,  3, 2,  40.00),
    (3,  2,  2, 1, 250.00),
    (4,  3,  1, 10, 60.00),
    (5,  4,  3, 5,  30.00),
    (6,  5,  1, 4,  60.00),
    (7,  6,  2, 2, 150.00),
    (8,  7,  5, 3, 200.00),
    (9,  8,  3, 4,  50.00),
    (10, 9,  1, 2,  60.00),
    (11, 10, 2, 3, 250.00);


-- 4c. Order Status Log  ----------------------------------------------------
-- Timeline of status transitions for each order
CREATE TABLE freshwash.order_status_log (
    status_id        SERIAL       PRIMARY KEY,
    order_id         INT          NOT NULL,
    status_name      VARCHAR(50)  NOT NULL,
    status_timestamp TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_status_log_order
        FOREIGN KEY (order_id) REFERENCES freshwash.laundry_order (order_id)
        ON DELETE CASCADE
);

COMMENT ON TABLE freshwash.order_status_log IS 'Append-only log of every status change for an order.';

CREATE INDEX idx_order_status_log_order_id ON freshwash.order_status_log (order_id);

INSERT INTO freshwash.order_status_log (status_id, order_id, status_name, status_timestamp) VALUES
    (1,  1,  'Picked Up',  '2026-02-14 21:37:05+00'),
    (2,  1,  'Washing',    '2026-02-14 21:37:05+00'),
    (3,  2,  'Picked Up',  '2026-02-14 21:37:05+00'),
    (4,  3,  'Delivered',  '2026-02-14 21:37:05+00'),
    (5,  4,  'Picked Up',  '2026-02-14 21:37:05+00'),
    (6,  5,  'Washing',    '2026-02-14 21:37:05+00'),
    (7,  6,  'Processing', '2026-02-14 21:37:05+00'),
    (8,  7,  'Ironing',    '2026-02-14 21:37:05+00'),
    (9,  9,  'Picked Up',  '2026-02-14 21:37:05+00'),
    (10, 10, 'Received',   '2026-02-14 21:37:05+00');


-- 4d. Order Assignment  ----------------------------------------------------
-- Assigns staff members to an order with a specific role
CREATE TABLE freshwash.order_assignment (
    assignment_id   SERIAL       PRIMARY KEY,
    order_id        INT          NOT NULL,
    employee_id     INT          NOT NULL,
    assigned_role   VARCHAR(50)  NOT NULL,
    assigned_date   TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_assignment_order
        FOREIGN KEY (order_id)    REFERENCES freshwash.laundry_order (order_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_order_assignment_employee
        FOREIGN KEY (employee_id) REFERENCES freshwash.employee (employee_id)
);

COMMENT ON TABLE freshwash.order_assignment IS 'Maps employees to orders with their operational role for that task.';

CREATE INDEX idx_order_assignment_order_id    ON freshwash.order_assignment (order_id);
CREATE INDEX idx_order_assignment_employee_id ON freshwash.order_assignment (employee_id);

INSERT INTO freshwash.order_assignment (assignment_id, order_id, employee_id, assigned_role, assigned_date) VALUES
    (1,  1,  2, 'Washing',      '2026-02-14 21:37:05+00'),
    (2,  1,  1, 'Pickup',       '2026-02-14 21:37:05+00'),
    (3,  2,  1, 'Pickup',       '2026-02-14 21:37:05+00'),
    (4,  3,  1, 'Delivery',     '2026-02-14 21:37:05+00'),
    (5,  4,  3, 'Ironing',      '2026-02-14 21:37:05+00'),
    (6,  5,  2, 'Washing',      '2026-02-14 21:37:05+00'),
    (7,  6,  5, 'Dry Cleaning', '2026-02-14 21:37:05+00'),
    (8,  7,  6, 'Delivery',     '2026-02-14 21:37:05+00'),
    (9,  9,  1, 'Pickup',       '2026-02-14 21:37:05+00'),
    (10, 10, 5, 'Dry Cleaning', '2026-02-14 21:37:05+00');


-- 4e. Payment  -------------------------------------------------------------
-- MySQL: payment_chk_1 → payment_amount > 0
CREATE TABLE freshwash.payment (
    payment_id      SERIAL          PRIMARY KEY,
    order_id        INT             NOT NULL,
    payment_mode    VARCHAR(50)     NOT NULL,
    payment_amount  NUMERIC(10, 2)  NOT NULL,
    payment_date    TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_payment_amount CHECK (payment_amount > 0),

    CONSTRAINT fk_payment_order
        FOREIGN KEY (order_id) REFERENCES freshwash.laundry_order (order_id)
        ON DELETE CASCADE
);

COMMENT ON TABLE freshwash.payment IS 'Payment transactions linked to laundry orders.';

CREATE INDEX idx_payment_order_id ON freshwash.payment (order_id);

INSERT INTO freshwash.payment (payment_id, order_id, payment_mode, payment_amount, payment_date) VALUES
    (1,  1,  'UPI',         500.00, '2026-02-14 21:37:05+00'),
    (2,  2,  'Cash',        250.00, '2026-02-14 21:37:05+00'),
    (3,  3,  'Credit Card',1000.00, '2026-02-14 21:37:05+00'),
    (4,  4,  'UPI',         150.00, '2026-02-14 21:37:05+00'),
    (5,  5,  'Cash',        450.00, '2026-02-14 21:37:05+00'),
    (6,  6,  'Credit Card', 300.00, '2026-02-14 21:37:05+00'),
    (7,  7,  'UPI',         600.00, '2026-02-14 21:37:05+00'),
    (8,  8,  'Cash',        200.00, '2026-02-14 21:37:05+00'),
    (9,  9,  'UPI',         120.00, '2026-02-14 21:37:05+00'),
    (10, 10, 'Credit Card', 800.00, '2026-02-14 21:37:05+00');


-- 4f. Payment Status  ------------------------------------------------------
CREATE TABLE freshwash.payment_status (
    payment_status_id   SERIAL       PRIMARY KEY,
    payment_id          INT          NOT NULL,
    status_name         VARCHAR(50)  NOT NULL,
    status_timestamp    TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_status_payment
        FOREIGN KEY (payment_id) REFERENCES freshwash.payment (payment_id)
        ON DELETE CASCADE
);

COMMENT ON TABLE freshwash.payment_status IS 'Tracks Success / Pending / Failed states for each payment.';

CREATE INDEX idx_payment_status_payment_id ON freshwash.payment_status (payment_id);

INSERT INTO freshwash.payment_status (payment_status_id, payment_id, status_name, status_timestamp) VALUES
    (1,  1,  'Success', '2026-02-14 21:37:05+00'),
    (2,  2,  'Pending', '2026-02-14 21:37:05+00'),
    (3,  3,  'Success', '2026-02-14 21:37:05+00'),
    (4,  4,  'Success', '2026-02-14 21:37:05+00'),
    (5,  5,  'Pending', '2026-02-14 21:37:05+00'),
    (6,  6,  'Success', '2026-02-14 21:37:05+00'),
    (7,  7,  'Success', '2026-02-14 21:37:05+00'),
    (8,  8,  'Failed',  '2026-02-14 21:37:05+00'),
    (9,  9,  'Success', '2026-02-14 21:37:05+00'),
    (10, 10, 'Success', '2026-02-14 21:37:05+00');


-- 4g. Feedback  ------------------------------------------------------------
-- MySQL: feedback_chk_1 → rating BETWEEN 1 AND 5
CREATE TABLE freshwash.feedback (
    feedback_id     SERIAL       PRIMARY KEY,
    member_id       INT          NOT NULL,
    order_id        INT          NOT NULL,
    rating          SMALLINT     NOT NULL,
    comments        TEXT,
    feedback_date   TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_feedback_rating CHECK (rating BETWEEN 1 AND 5),

    CONSTRAINT fk_feedback_member
        FOREIGN KEY (member_id) REFERENCES freshwash.member (member_id),
    CONSTRAINT fk_feedback_order
        FOREIGN KEY (order_id)  REFERENCES freshwash.laundry_order (order_id)
);

COMMENT ON TABLE freshwash.feedback IS 'Customer satisfaction ratings (1-5) and comments per order.';

CREATE INDEX idx_feedback_member_id ON freshwash.feedback (member_id);
CREATE INDEX idx_feedback_order_id  ON freshwash.feedback (order_id);

INSERT INTO freshwash.feedback (feedback_id, member_id, order_id, rating, comments, feedback_date) VALUES
    (1,  3,  3,  5, 'Excellent service, delivered on time!',          '2026-02-14 21:37:05+00'),
    (2,  1,  1,  4, 'Good wash, but folding could be better.',        '2026-02-14 21:37:05+00'),
    (3,  4,  4,  3, 'Ironing was okay, but delivery was late.',       '2026-02-14 21:37:05+00'),
    (4,  7,  7,  5, 'Super fast express delivery.',                   '2026-02-14 21:37:05+00'),
    (5,  2,  2,  2, 'Pickup was delayed by an hour.',                 '2026-02-14 21:37:05+00'),
    (6,  5,  5,  5, 'Dry cleaning quality was excellent.',            '2026-02-14 21:37:05+00'),
    (7,  6,  6,  4, 'Driver was polite and punctual.',                '2026-02-14 21:37:05+00'),
    (8,  8,  8,  3, 'Service was average, expected better packaging.','2026-02-14 21:37:05+00'),
    (9,  9,  9,  1, 'Very poor stain removal. Disappointed.',         '2026-02-14 21:37:05+00'),
    (10, 10, 10, 4, 'Overall good experience, will use again.',       '2026-02-14 21:37:05+00');


-- 4h. Lost Item  -----------------------------------------------------------
CREATE TABLE freshwash.lost_item (
    lost_id               SERIAL          PRIMARY KEY,
    order_id              INT             NOT NULL,
    item_description      VARCHAR(255)    NOT NULL,
    reported_date         TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    compensation_amount   NUMERIC(10, 2)  NOT NULL DEFAULT 0.00,

    CONSTRAINT fk_lost_item_order
        FOREIGN KEY (order_id) REFERENCES freshwash.laundry_order (order_id)
        ON DELETE CASCADE
);

COMMENT ON TABLE freshwash.lost_item IS 'Reports of lost, damaged, or missing items with compensation tracking.';

CREATE INDEX idx_lost_item_order_id ON freshwash.lost_item (order_id);

INSERT INTO freshwash.lost_item (lost_id, order_id, item_description, reported_date, compensation_amount) VALUES
    (1,  5,  'Blue handkerchief missing',            '2026-02-14 21:37:05+00',  50.00),
    (2,  8,  'Button missing on shirt',              '2026-02-14 21:37:05+00',  20.00),
    (3,  2,  'Single sock missing',                  '2026-02-14 21:37:05+00',  30.00),
    (4,  7,  'Scarf misplaced during washing',       '2026-02-14 21:37:05+00',  80.00),
    (5,  4,  'Stain on white kurta after wash',      '2026-02-14 21:37:05+00', 120.00),
    (6,  9,  'Belt missing from trousers',           '2026-02-14 21:37:05+00',  70.00),
    (7,  1,  'Cap lost during processing',           '2026-02-14 21:37:05+00',  40.00),
    (8,  6,  'Pocket torn on jeans',                 '2026-02-14 21:37:05+00', 150.00),
    (9,  10, 'Silk dupatta damaged',                 '2026-02-14 21:37:05+00', 200.00),
    (10, 3,  'Tie missing after dry cleaning',       '2026-02-14 21:37:05+00',  60.00);


-- =============================================================================
-- SECTION 5: SECURITY TABLES
-- Depend on: users
-- =============================================================================

-- 5a. Sessions  ------------------------------------------------------------
-- Tracks active user sessions using UUID tokens (via uuid-ossp extension)
CREATE TABLE freshwash.sessions (
    session_id      SERIAL          PRIMARY KEY,
    user_id         INT             NOT NULL,
    session_token   UUID            NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at      TIMESTAMPTZ     NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours'),
    ip_address      VARCHAR(45),               -- Supports both IPv4 and IPv6
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_sessions_user
        FOREIGN KEY (user_id) REFERENCES freshwash.users (user_id)
        ON DELETE CASCADE
);

COMMENT ON TABLE  freshwash.sessions IS 'Active login sessions. session_token is a UUID used as a bearer token.';
COMMENT ON COLUMN freshwash.sessions.ip_address IS 'VARCHAR(45) accommodates full IPv6 addresses.';

-- Index on token for fast session lookup on every authenticated request
CREATE INDEX idx_sessions_token   ON freshwash.sessions (session_token);
CREATE INDEX idx_sessions_user_id ON freshwash.sessions (user_id);

-- Seed two sample active sessions
INSERT INTO freshwash.sessions (user_id, session_token, expires_at) VALUES
    (1, uuid_generate_v4(), CURRENT_TIMESTAMP + INTERVAL '24 hours'),
    (2, uuid_generate_v4(), CURRENT_TIMESTAMP + INTERVAL '24 hours');


-- =============================================================================
-- SECTION 6: AUDIT LOG TABLE
-- Must be defined BEFORE the audit trigger is created.
-- =============================================================================

-- 6a. Audit Logs  ----------------------------------------------------------
-- Immutable append-only table – records every DML change to project tables.
CREATE TABLE freshwash.audit_logs (
    audit_id        BIGSERIAL       PRIMARY KEY,       -- BIGSERIAL for high-volume growth
    table_name      VARCHAR(100)    NOT NULL,
    operation       VARCHAR(10)     NOT NULL,          -- INSERT | UPDATE | DELETE
    old_data        JSONB,                             -- Previous row state (NULL for INSERT)
    new_data        JSONB,                             -- New row state (NULL for DELETE)
    changed_by      VARCHAR(100)    NOT NULL DEFAULT current_user,
    changed_at      TIMESTAMPTZ     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    session_user_id INT,                               -- App-level user ID (optional context)

    CONSTRAINT chk_audit_operation
        CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE'))
);

COMMENT ON TABLE  freshwash.audit_logs IS
    'Immutable DML audit trail. old_data/new_data stored as JSONB for full row snapshots.';
COMMENT ON COLUMN freshwash.audit_logs.old_data IS 'Full previous row as JSON; NULL for INSERT operations.';
COMMENT ON COLUMN freshwash.audit_logs.new_data IS 'Full new row as JSON; NULL for DELETE operations.';

-- Index for efficient querying by table or time range
CREATE INDEX idx_audit_logs_table_name ON freshwash.audit_logs (table_name);
CREATE INDEX idx_audit_logs_changed_at ON freshwash.audit_logs (changed_at DESC);


-- =============================================================================
-- SECTION 7: AUDIT TRIGGER FUNCTION & TRIGGERS
-- Fires AFTER INSERT, UPDATE, or DELETE on every project-specific table.
-- =============================================================================

-- 7a. Generic Audit Trigger Function  --------------------------------------
--
-- How it works:
--   1. The single PL/pgSQL function is shared by ALL table triggers.
--   2. TG_TABLE_NAME gives the triggering table's name automatically.
--   3. OLD / NEW row records are cast to JSONB using row_to_json().
--   4. The AFTER timing ensures the row is fully committed before logging.
--   5. Returns NULL for AFTER triggers (return value is ignored by PG).
--
CREATE OR REPLACE FUNCTION freshwash.fn_audit_logger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER   -- runs with definer's privileges to always write to audit_logs
AS $$
BEGIN
    INSERT INTO freshwash.audit_logs (table_name, operation, old_data, new_data)
    VALUES (
        TG_TABLE_NAME,
        TG_OP,                                              -- 'INSERT' | 'UPDATE' | 'DELETE'
        CASE WHEN TG_OP = 'INSERT' THEN NULL
             ELSE      row_to_json(OLD)::JSONB  END,        -- Capture old state
        CASE WHEN TG_OP = 'DELETE' THEN NULL
             ELSE      row_to_json(NEW)::JSONB  END         -- Capture new state
    );
    RETURN NULL;   -- AFTER trigger: return value is irrelevant
END;
$$;

COMMENT ON FUNCTION freshwash.fn_audit_logger() IS
    'Generic AFTER trigger function. Inserts one row into audit_logs for every DML event.';


-- 7b. Attach Trigger to Every Project Table  --------------------------------
--
-- Pattern: tr_audit_<table_name>
-- The same function handles INSERT/UPDATE/DELETE for each table.
--

CREATE TRIGGER tr_audit_clothing_type
    AFTER INSERT OR UPDATE OR DELETE ON freshwash.clothing_type
    FOR EACH ROW EXECUTE FUNCTION freshwash.fn_audit_logger();

CREATE TRIGGER tr_audit_service
    AFTER INSERT OR UPDATE OR DELETE ON freshwash.service
    FOR EACH ROW EXECUTE FUNCTION freshwash.fn_audit_logger();

CREATE TRIGGER tr_audit_employee
    AFTER INSERT OR UPDATE OR DELETE ON freshwash.employee
    FOR EACH ROW EXECUTE FUNCTION freshwash.fn_audit_logger();

CREATE TRIGGER tr_audit_member
    AFTER INSERT OR UPDATE OR DELETE ON freshwash.member
    FOR EACH ROW EXECUTE FUNCTION freshwash.fn_audit_logger();

CREATE TRIGGER tr_audit_price
    AFTER INSERT OR UPDATE OR DELETE ON freshwash.price
    FOR EACH ROW EXECUTE FUNCTION freshwash.fn_audit_logger();

CREATE TRIGGER tr_audit_laundry_order
    AFTER INSERT OR UPDATE OR DELETE ON freshwash.laundry_order
    FOR EACH ROW EXECUTE FUNCTION freshwash.fn_audit_logger();

CREATE TRIGGER tr_audit_order_service
    AFTER INSERT OR UPDATE OR DELETE ON freshwash.order_service
    FOR EACH ROW EXECUTE FUNCTION freshwash.fn_audit_logger();

CREATE TRIGGER tr_audit_order_status_log
    AFTER INSERT OR UPDATE OR DELETE ON freshwash.order_status_log
    FOR EACH ROW EXECUTE FUNCTION freshwash.fn_audit_logger();

CREATE TRIGGER tr_audit_order_assignment
    AFTER INSERT OR UPDATE OR DELETE ON freshwash.order_assignment
    FOR EACH ROW EXECUTE FUNCTION freshwash.fn_audit_logger();

CREATE TRIGGER tr_audit_payment
    AFTER INSERT OR UPDATE OR DELETE ON freshwash.payment
    FOR EACH ROW EXECUTE FUNCTION freshwash.fn_audit_logger();

CREATE TRIGGER tr_audit_payment_status
    AFTER INSERT OR UPDATE OR DELETE ON freshwash.payment_status
    FOR EACH ROW EXECUTE FUNCTION freshwash.fn_audit_logger();

CREATE TRIGGER tr_audit_feedback
    AFTER INSERT OR UPDATE OR DELETE ON freshwash.feedback
    FOR EACH ROW EXECUTE FUNCTION freshwash.fn_audit_logger();

CREATE TRIGGER tr_audit_lost_item
    AFTER INSERT OR UPDATE OR DELETE ON freshwash.lost_item
    FOR EACH ROW EXECUTE FUNCTION freshwash.fn_audit_logger();


-- =============================================================================
-- SECTION 8: VIEW – member_portfolio_view
-- Aggregates member profile + order history for a web UI dashboard.
-- =============================================================================

CREATE OR REPLACE VIEW freshwash.member_portfolio_view AS
SELECT
    -- Member Profile
    m.member_id,
    m.name                          AS member_name,
    m.email,
    m.contact_number,
    m.address,
    m.age,
    m.created_at                    AS member_since,

    -- Order Summary
    COUNT(DISTINCT lo.order_id)     AS total_orders,
    COALESCE(SUM(lo.total_amount), 0.00)
                                    AS lifetime_spend,
    MAX(lo.order_date)              AS last_order_date,

    -- Feedback Summary
    ROUND(AVG(f.rating)::NUMERIC, 2)
                                    AS avg_rating,
    COUNT(DISTINCT f.feedback_id)   AS total_feedbacks,

    -- Lost Item Count
    COUNT(DISTINCT li.lost_id)      AS lost_item_reports

FROM freshwash.member m

LEFT JOIN freshwash.laundry_order lo
    ON lo.member_id = m.member_id

LEFT JOIN freshwash.feedback f
    ON f.member_id = m.member_id

LEFT JOIN freshwash.lost_item li
    ON li.order_id = lo.order_id

GROUP BY
    m.member_id,
    m.name,
    m.email,
    m.contact_number,
    m.address,
    m.age,
    m.created_at;

COMMENT ON VIEW freshwash.member_portfolio_view IS
    'Web UI dashboard view: aggregates member profile, order history, spend, ratings, and lost item reports.';


-- =============================================================================
-- SECTION 9: SEQUENCE RESET
-- After bulk INSERT with explicit IDs, reset each SERIAL sequence to avoid
-- primary-key collisions on subsequent auto-generated inserts.
-- =============================================================================

SELECT setval('freshwash.roles_role_id_seq',             (SELECT MAX(role_id)             FROM freshwash.roles));
SELECT setval('freshwash.users_user_id_seq',             (SELECT MAX(user_id)             FROM freshwash.users));
SELECT setval('freshwash.clothing_type_type_id_seq',     (SELECT MAX(type_id)             FROM freshwash.clothing_type));
SELECT setval('freshwash.service_service_id_seq',        (SELECT MAX(service_id)          FROM freshwash.service));
SELECT setval('freshwash.employee_employee_id_seq',      (SELECT MAX(employee_id)         FROM freshwash.employee));
SELECT setval('freshwash.member_member_id_seq',          (SELECT MAX(member_id)           FROM freshwash.member));
SELECT setval('freshwash.price_price_id_seq',            (SELECT MAX(price_id)            FROM freshwash.price));
SELECT setval('freshwash.laundry_order_order_id_seq',    (SELECT MAX(order_id)            FROM freshwash.laundry_order));
SELECT setval('freshwash.order_service_order_service_id_seq', (SELECT MAX(order_service_id) FROM freshwash.order_service));
SELECT setval('freshwash.order_status_log_status_id_seq',(SELECT MAX(status_id)           FROM freshwash.order_status_log));
SELECT setval('freshwash.order_assignment_assignment_id_seq', (SELECT MAX(assignment_id)  FROM freshwash.order_assignment));
SELECT setval('freshwash.payment_payment_id_seq',        (SELECT MAX(payment_id)          FROM freshwash.payment));
SELECT setval('freshwash.payment_status_payment_status_id_seq', (SELECT MAX(payment_status_id) FROM freshwash.payment_status));
SELECT setval('freshwash.feedback_feedback_id_seq',      (SELECT MAX(feedback_id)         FROM freshwash.feedback));
SELECT setval('freshwash.lost_item_lost_id_seq',         (SELECT MAX(lost_id)             FROM freshwash.lost_item));


-- =============================================================================
-- END OF SCHEMA
-- FreshWash Laundry Management System | CS 432 Databases – Assignment 2
-- =============================================================================
