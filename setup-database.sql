-- Vehicle KM Tracker Database Setup for Supabase
-- Run this SQL in Supabase SQL Editor

-- Create enum types
CREATE TYPE "Role" AS ENUM ('ADMIN', 'DRIVER');
CREATE TYPE "Status" AS ENUM ('AVAILABLE', 'RUNNING');

-- Create User table
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create Vehicle table
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "vehicleNo" TEXT NOT NULL,
    "currentKm" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- Create Trip table
CREATE TABLE "Trip" (
    "id" SERIAL NOT NULL,
    "startKm" INTEGER NOT NULL,
    "endKm" INTEGER,
    "distance" INTEGER,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "driverId" INTEGER NOT NULL,
    "vehicleId" INTEGER NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- Create unique indexes
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "Vehicle_vehicleNo_key" ON "Vehicle"("vehicleNo");

-- Add foreign key constraints
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Insert demo data
-- Admin user (password: admin123)
INSERT INTO "User" ("name", "username", "password", "role") VALUES 
('Admin User', 'admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN');

-- Driver user (password: driver123)  
INSERT INTO "User" ("name", "username", "password", "role") VALUES 
('John Driver', 'driver1', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DRIVER');

-- Sample vehicles
INSERT INTO "Vehicle" ("vehicleNo", "currentKm", "status") VALUES 
('KA-01-AB-1234', 15000, 'AVAILABLE'),
('KA-02-CD-5678', 25000, 'AVAILABLE'),
('KA-03-EF-9012', 18000, 'AVAILABLE');

-- Sample trips
INSERT INTO "Trip" ("startKm", "endKm", "distance", "startTime", "endTime", "driverId", "vehicleId") VALUES 
(15000, 15050, 50, '2024-01-01 09:00:00', '2024-01-01 10:30:00', 2, 1),
(25000, 25075, 75, '2024-01-02 14:00:00', '2024-01-02 16:00:00', 2, 2),
(18000, 18030, 30, '2024-01-03 11:00:00', '2024-01-03 12:00:00', 2, 3);
