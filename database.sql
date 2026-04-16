
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS employees (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(50)  NOT NULL UNIQUE,
    password_hash   TEXT         NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    department      VARCHAR(100),
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id     UUID         NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    token           VARCHAR(512) NOT NULL UNIQUE,
    last_activity   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ  NOT NULL,
    is_valid        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_token       ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_employee_id ON sessions(employee_id);


CREATE TYPE attendance_status AS ENUM ('checked_in', 'checked_out');

CREATE TABLE IF NOT EXISTS attendance (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id     UUID               NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    date            DATE               NOT NULL,
    check_in_time   TIMESTAMPTZ,
    check_out_time  TIMESTAMPTZ,
    total_hours     NUMERIC(5, 2),
    status          attendance_status  NOT NULL DEFAULT 'checked_in',
    created_at      TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ        NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_employee_date UNIQUE (employee_id, date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_employee_id ON attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date         ON attendance(date);


CREATE TYPE leave_type_enum   AS ENUM ('sick', 'casual', 'annual', 'unpaid', 'other');
CREATE TYPE leave_status_enum AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS leave_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id     UUID              NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    start_date      DATE              NOT NULL,
    end_date        DATE              NOT NULL,
    leave_type      leave_type_enum   NOT NULL,
    reason          TEXT              NOT NULL,
    status          leave_status_enum NOT NULL DEFAULT 'pending',
    created_at      TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_id ON leave_requests(employee_id);


INSERT INTO employees (username, password_hash, full_name, email, department)
VALUES
    (
        'john.doe',
        '$2a$10$xLAigEzEr4xvX9YijqIVPeQr5dNNqEQwuT6AcQlNJZiDAMcB3lkMq',
        'John Doe',
        'john.doe@company.com',
        'Engineering'
    ),
    (
        'jane.smith',
        '$2a$10$xLAigEzEr4xvX9YijqIVPeQr5dNNqEQwuT6AcQlNJZiDAMcB3lkMq',
        'Jane Smith',
        'jane.smith@company.com',
        'HR'
    ),
    (
        'alice.wang',
        '$2a$10$xLAigEzEr4xvX9YijqIVPeQr5dNNqEQwuT6AcQlNJZiDAMcB3lkMq',
        'Alice Wang',
        'alice.wang@company.com',
        'Design'
    )
ON CONFLICT (username) DO NOTHING;
