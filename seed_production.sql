-- Seed production database with essential data
-- This script will insert basic data needed for the rental manager

-- Insert sample houses
INSERT INTO houses (id, name, address, floors, rooms, remarks, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-447655080100', 'House A', '123 Main St, City', 2, 4, 'Main building', NOW(), NOW()),
('550e8400-e29b-41d4-a716-447655080101', 'House B', '456 Oak Ave, City', 3, 6, 'Secondary building', NOW(), NOW());

-- Insert sample tenants
INSERT INTO tenants (id, user_id, name, phone, citizenship_number, address, occupation, family_members, house_id, room_number, monthly_rent, move_in_date, is_active, remarks, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-447655080200', '550e8400-e29b-41d4-a716-447655080100', 'John Doe', '9876543210', '1234567890', '123 Main St, City', 'Software Engineer', 2, '550e8400-e29b-41d4-a716-447655080100', '101', 15000, '2024-01-01', true, 'Good tenant', NOW(), NOW()),
('550e8400-e29b-41d4-a716-447655080201', '550e8400-e29b-41d4-a716-447655080100', 'Jane Smith', '9876543211', '0987654321', '456 Oak Ave, City', 'Teacher', 3, '550e8400-e29b-41d4-a716-447655080101', '201', 18000, '2024-02-01', true, 'Pays on time', NOW(), NOW());

-- Insert sample billing records
INSERT INTO monthly_billing (id, user_id, tenant_id, house_id, billing_month, billing_year, rent_amount, water_bill_type, water_fixed_amount, water_units, water_rate, electricity_bill_type, electricity_fixed_amount, electricity_units, electricity_rate, sanitation_charge, extra_charges, total_amount, paid_amount, remaining_due, payment_status, payment_date, payment_mode, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-447655080300', '550e8400-e29b-41d4-a716-447655080100', '550e8400-e29b-41d4-a716-447655080200', '550e8400-e29b-41d4-a716-447655080100', 2, 2026, 15000, 'fixed', 500, 0, 0, 'fixed', 800, 0, 0, 200, '[{"label": "Maintenance", "amount": 200}]', 16500, 16500, 0, 'paid', '2026-02-15', 'cash', NOW(), NOW()),
('550e8400-e29b-41d4-a716-447655080301', '550e8400-e29b-41d4-a716-447655080100', '550e8400-e29b-41d4-a716-447655080201', '550e8400-e29b-41d4-a716-447655080101', 2, 2026, 18000, 'meter_based', 0, 50, 8, 'meter_based', 0, 120, 6, 300, '[{"label": "Parking", "amount": 150}, {"label": "Internet", "amount": 50}]', 21600, 10000, 11600, 'partial', '2026-02-20', 'online', NOW(), NOW());
