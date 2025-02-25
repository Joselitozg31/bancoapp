-- Tabla de usuarios
CREATE TABLE users (
    document_number VARCHAR(50) PRIMARY KEY UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    country VARCHAR(100) NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    password VARCHAR(255) NOT NULL,
    verified BOOLEAN DEFAULT FALSE NOT NULL,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Tabla de cuentas bancarias
CREATE TABLE accounts (
    iban VARCHAR(34) PRIMARY KEY UNIQUE NOT NULL,
    account_type VARCHAR(50) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    total_balance DECIMAL(15, 2) NOT NULL,
    available_balance DECIMAL(15, 2) NOT NULL,
    held_balance DECIMAL(15, 2) NOT NULL,
    opening_date DATE NOT NULL
);

-- Tabla intermedia para relacionar usuarios y cuentas
CREATE TABLE user_accounts (
    user_document_number VARCHAR(50) NOT NULL,
    account_iban VARCHAR(34) NOT NULL,
    PRIMARY KEY (user_document_number, account_iban),
    FOREIGN KEY (user_document_number) REFERENCES users(document_number),
    FOREIGN KEY (account_iban) REFERENCES accounts(iban)
);

-- Tabla de tarjetas bancarias
CREATE TABLE cards (
    card_number VARCHAR(16) PRIMARY KEY UNIQUE NOT NULL,
    card_type VARCHAR(50) NOT NULL,
    expiration_date DATE NOT NULL,
    hiring_date DATE NOT NULL,
    ccv VARCHAR(3) NOT NULL,
    account_iban VARCHAR(34) NOT NULL,
    user_document_number VARCHAR(50) NOT NULL,
    FOREIGN KEY (account_iban) REFERENCES accounts(iban),
    FOREIGN KEY (user_document_number) REFERENCES users(document_number)
);

-- Tabla de transferencias
CREATE TABLE transfers (
    transfer_id INT AUTO_INCREMENT PRIMARY KEY,
    origin_account_iban VARCHAR(34) NOT NULL,
    destination_account_iban VARCHAR(34) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    transfer_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    concept TEXT NOT NULL,
    FOREIGN KEY (origin_account_iban) REFERENCES accounts(iban),
    FOREIGN KEY (destination_account_iban) REFERENCES accounts(iban)
);

-- Tabla de seguros
CREATE TABLE insurances (
    insurance_id INT AUTO_INCREMENT PRIMARY KEY,
    insurance_type VARCHAR(50) NOT NULL,
    hiring_date DATE NOT NULL,
    expiration_date DATE NOT NULL
);

-- Tabla intermedia para relacionar usuarios, cuentas y seguros
CREATE TABLE user_account_insurances (
    user_document_number VARCHAR(50) NOT NULL,
    account_iban VARCHAR(34) NOT NULL,
    insurance_id INT NOT NULL,
    PRIMARY KEY (user_document_number, account_iban, insurance_id),
    FOREIGN KEY (user_document_number) REFERENCES users(document_number),
    FOREIGN KEY (account_iban) REFERENCES accounts(iban),
    FOREIGN KEY (insurance_id) REFERENCES insurances(insurance_id)
);
-- Tabla de transacciones
CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    account_iban VARCHAR(34) NOT NULL,
    user_document_number VARCHAR(50) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    transaction_type ENUM('income', 'expense', 'held') NOT NULL,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    concept TEXT NOT NULL,
    FOREIGN KEY (account_iban) REFERENCES accounts(iban),
    FOREIGN KEY (user_document_number) REFERENCES users(document_number)
);

-- Tabla de mensajes de contacto
CREATE TABLE messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    user_document_number VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sent_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_document_number) REFERENCES users(document_number)
);

