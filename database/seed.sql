-------------------------------------------------------------
-------------------------------------------------------------
INSERT INTO tenants (id, verified, stripe_customer_id)
VALUES ('default-254a-4e09-a7b7-65a0acbe8f1c', TRUE, 'app_name');

-- Use the new ID in another statement
INSERT INTO users(email, verified, tenant_id)
VALUES('example@email.com', TRUE, 'default-254a-4e09-a7b7-65a0acbe8f1c');