Go
-- 1. Users Table
CREATE TABLE users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    first_name NVARCHAR(50) NOT NULL,
    last_name NVARCHAR(50) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    phone NVARCHAR(15),
    location NVARCHAR(100),
    created_at DATETIME DEFAULT GETDATE()
);

-- 2. Artists Table
CREATE TABLE artists (
    artist_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    bio NVARCHAR(MAX),
    profile_picture NVARCHAR(255),
    portfolio_link NVARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. Categories Table
CREATE TABLE categories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    category_name NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX)
);

-- 4. Services Table
CREATE TABLE services (
    service_id INT IDENTITY(1,1) PRIMARY KEY,
    service_name NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    category_id INT,
    image_url NVARCHAR(255),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- 5. Portfolios Table
CREATE TABLE portfolios (
    portfolio_id INT IDENTITY(1,1) PRIMARY KEY,
    artist_id INT,
    service_id INT,
    portfolio_image NVARCHAR(255),
    description NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id)
);

-- 6. Bookings Table
CREATE TABLE bookings (
    booking_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    artist_id INT,
    service_id INT,
    booking_date DATETIME DEFAULT GETDATE(),
    event_date DATE NOT NULL,
    status NVARCHAR(50) DEFAULT 'Pending', -- e.g., 'Pending', 'Confirmed', 'Completed', 'Cancelled'
    total_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id)
);

-- 7. Reviews Table
CREATE TABLE reviews (
    review_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    artist_id INT,
    service_id INT,
    rating TINYINT CHECK (rating BETWEEN 1 AND 5),
    comment NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id)
);

-- 8. Payments Table
CREATE TABLE payments (
    payment_id INT IDENTITY(1,1) PRIMARY KEY,
    booking_id INT,
    payment_date DATETIME DEFAULT GETDATE(),
    payment_method NVARCHAR(50), -- e.g., 'Credit Card', 'UPI', 'Cash'
    amount DECIMAL(10, 2) NOT NULL,
    status NVARCHAR(50) DEFAULT 'Completed',
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- 9. Events Table
CREATE TABLE events (
    event_id INT IDENTITY(1,1) PRIMARY KEY,
    artist_id INT,
    event_name NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    event_date DATE NOT NULL,
    location NVARCHAR(100),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id)
);

-- 10. User_Favorites Table
CREATE TABLE user_favorites (
    favorite_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    artist_id INT,
    service_id INT,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id),
    FOREIGN KEY (service_id) REFERENCES services(service_id)
);

-- 11. Notifications Table
CREATE TABLE notifications (
    notification_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT,
    message NVARCHAR(MAX) NOT NULL,
    is_read BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 12. Artist_Availability Table
CREATE TABLE artist_availability (
    availability_id INT IDENTITY(1,1) PRIMARY KEY,
    artist_id INT,
    day_of_week NVARCHAR(15), -- e.g., 'Monday', 'Tuesday'
    start_time TIME,
    end_time TIME,
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id)
);

-- 13. Admins Table
CREATE TABLE admins (
    admin_id INT IDENTITY(1,1) PRIMARY KEY,
    first_name NVARCHAR(50) NOT NULL,
    last_name NVARCHAR(50) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);
