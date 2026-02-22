SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict 9CuvxjDqzpYF3waAGLWtcx26wUEdi1jJq9btGfWnxaoZa0BsaIDB6bOlSGruLRX

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'c1c380da-a4ea-4078-8226-b857b66ff86f', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"kishoriraut369@gmail.com","user_id":"72617b6d-582a-434f-b380-bc76d6691b2c","user_phone":""}}', '2026-02-21 15:24:11.215348+00', ''),
	('00000000-0000-0000-0000-000000000000', '6b80a22b-1ee9-4482-840a-c8e3d4effbb2', '{"action":"login","actor_id":"72617b6d-582a-434f-b380-bc76d6691b2c","actor_username":"kishoriraut369@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-02-21 15:24:24.783707+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac88efd8-e37c-4e59-a5ec-51e324919ddc', '{"action":"login","actor_id":"72617b6d-582a-434f-b380-bc76d6691b2c","actor_username":"kishoriraut369@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-02-21 15:27:36.259886+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c4db4ace-f188-4ddc-8cac-ff3d43fa4df1', '{"action":"logout","actor_id":"72617b6d-582a-434f-b380-bc76d6691b2c","actor_username":"kishoriraut369@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-02-21 15:31:49.161961+00', ''),
	('00000000-0000-0000-0000-000000000000', '144eff3b-e1bc-406e-9353-8ef3512232f6', '{"action":"login","actor_id":"72617b6d-582a-434f-b380-bc76d6691b2c","actor_username":"kishoriraut369@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-02-21 15:31:51.481241+00', ''),
	('00000000-0000-0000-0000-000000000000', '028d3cd0-176d-4ffc-a86e-8d71f06242c5', '{"action":"login","actor_id":"72617b6d-582a-434f-b380-bc76d6691b2c","actor_username":"kishoriraut369@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-02-22 07:37:16.72791+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ca35903c-668c-4070-9f27-aae78ad777d2', '{"action":"token_refreshed","actor_id":"72617b6d-582a-434f-b380-bc76d6691b2c","actor_username":"kishoriraut369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-02-22 07:46:22.864081+00', ''),
	('00000000-0000-0000-0000-000000000000', '1c3a71dd-6986-453a-96e5-7fa2763c54cf', '{"action":"token_revoked","actor_id":"72617b6d-582a-434f-b380-bc76d6691b2c","actor_username":"kishoriraut369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-02-22 07:46:22.865695+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b81908de-da6b-46c1-939f-0a32b930c587', '{"action":"token_refreshed","actor_id":"72617b6d-582a-434f-b380-bc76d6691b2c","actor_username":"kishoriraut369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-02-22 09:11:10.975024+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e7671182-9e0b-4691-af78-b13027ea1663', '{"action":"token_revoked","actor_id":"72617b6d-582a-434f-b380-bc76d6691b2c","actor_username":"kishoriraut369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-02-22 09:11:10.979283+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e2f3d105-d17a-48e6-bb61-22e8dc625cc8', '{"action":"token_refreshed","actor_id":"72617b6d-582a-434f-b380-bc76d6691b2c","actor_username":"kishoriraut369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-02-22 09:12:34.6551+00', ''),
	('00000000-0000-0000-0000-000000000000', '5b240c8d-0b3a-4a76-843f-5aa8a4ee517b', '{"action":"token_revoked","actor_id":"72617b6d-582a-434f-b380-bc76d6691b2c","actor_username":"kishoriraut369@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-02-22 09:12:34.656138+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '72617b6d-582a-434f-b380-bc76d6691b2c', 'authenticated', 'authenticated', 'kishoriraut369@gmail.com', '$2a$10$UFtMu1tngfcyAWhgZYNhXeCr78sEa/DNSqA2pgBaZY6kRgImkfeh6', '2026-02-21 15:24:11.218765+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-02-22 07:37:16.732798+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-02-21 15:24:11.198716+00', '2026-02-22 09:12:34.658896+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('72617b6d-582a-434f-b380-bc76d6691b2c', '72617b6d-582a-434f-b380-bc76d6691b2c', '{"sub": "72617b6d-582a-434f-b380-bc76d6691b2c", "email": "kishoriraut369@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-02-21 15:24:11.211128+00', '2026-02-21 15:24:11.211268+00', '2026-02-21 15:24:11.211268+00', 'b56f7212-4ff2-4ddd-8a1e-b8b79d9c19fa');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('7f759e9c-3c9e-447a-ba5e-007e03fbb23b', '72617b6d-582a-434f-b380-bc76d6691b2c', '2026-02-21 15:31:51.485894+00', '2026-02-22 09:11:10.99941+00', NULL, 'aal1', NULL, '2026-02-22 09:11:10.999254', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '172.18.0.1', NULL, NULL, NULL, NULL, NULL),
	('a7d7d054-26a1-4ef0-a454-8dfd6ceb9511', '72617b6d-582a-434f-b380-bc76d6691b2c', '2026-02-22 07:37:16.732882+00', '2026-02-22 09:12:34.661176+00', NULL, 'aal1', NULL, '2026-02-22 09:12:34.661069', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36 Edg/145.0.0.0', '172.18.0.1', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('7f759e9c-3c9e-447a-ba5e-007e03fbb23b', '2026-02-21 15:31:51.498684+00', '2026-02-21 15:31:51.498684+00', 'password', 'e1dbae3d-e1ce-4733-bec5-04684d8ef971'),
	('a7d7d054-26a1-4ef0-a454-8dfd6ceb9511', '2026-02-22 07:37:16.742545+00', '2026-02-22 07:37:16.742545+00', 'password', 'ea712f94-9399-4155-9734-0c8aa9a2518f');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 3, 'blzvxqi3zj2h', '72617b6d-582a-434f-b380-bc76d6691b2c', true, '2026-02-21 15:31:51.494897+00', '2026-02-22 07:46:22.866514+00', NULL, '7f759e9c-3c9e-447a-ba5e-007e03fbb23b'),
	('00000000-0000-0000-0000-000000000000', 5, 'gyiumxrja3rt', '72617b6d-582a-434f-b380-bc76d6691b2c', true, '2026-02-22 07:46:22.867512+00', '2026-02-22 09:11:10.985921+00', 'blzvxqi3zj2h', '7f759e9c-3c9e-447a-ba5e-007e03fbb23b'),
	('00000000-0000-0000-0000-000000000000', 6, 'd4d22imwyrdf', '72617b6d-582a-434f-b380-bc76d6691b2c', false, '2026-02-22 09:11:10.989926+00', '2026-02-22 09:11:10.989926+00', 'gyiumxrja3rt', '7f759e9c-3c9e-447a-ba5e-007e03fbb23b'),
	('00000000-0000-0000-0000-000000000000', 4, 'kvzmrjqzch2m', '72617b6d-582a-434f-b380-bc76d6691b2c', true, '2026-02-22 07:37:16.737204+00', '2026-02-22 09:12:34.656979+00', NULL, 'a7d7d054-26a1-4ef0-a454-8dfd6ceb9511'),
	('00000000-0000-0000-0000-000000000000', 7, 'lxmsjeumkrgk', '72617b6d-582a-434f-b380-bc76d6691b2c', false, '2026-02-22 09:12:34.657737+00', '2026-02-22 09:12:34.657737+00', 'kvzmrjqzch2m', 'a7d7d054-26a1-4ef0-a454-8dfd6ceb9511');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: houses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."houses" ("id", "user_id", "name", "address", "floors", "rooms", "remarks", "created_at", "updated_at") VALUES
	('6bee4a93-e3ec-4f51-8e41-3a3379af9bd7', 'cd8486c1-b5ed-4874-b525-6c5413215291', 'ram', 'kusunti', 1, 1, 'new', '2026-02-21 15:04:50.153301+00', '2026-02-21 15:04:50.153301+00'),
	('6280229c-0178-4a26-8834-364d0ac23b4c', '72617b6d-582a-434f-b380-bc76d6691b2c', 'Talchhikhel house', 'Talchhikhel', 1, 1, NULL, '2026-02-22 09:26:48.365575+00', '2026-02-22 09:26:48.365575+00');


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tenants" ("id", "user_id", "name", "phone", "citizenship_number", "address", "occupation", "family_members", "house_id", "room_number", "monthly_rent", "move_in_date", "is_active", "remarks", "created_at", "updated_at") VALUES
	('ba65bcc9-4a7d-4b94-a55e-4165538c8d5c', 'cd8486c1-b5ed-4874-b525-6c5413215291', 'deepak kc', '9851241261', '432178', 'Kusunti', 'Household worker', 2, '6bee4a93-e3ec-4f51-8e41-3a3379af9bd7', '3', 4500.00, '2026-02-21', true, NULL, '2026-02-21 15:05:36.19737+00', '2026-02-21 15:05:36.19737+00'),
	('23c042aa-221f-4c3e-8bda-bb12de7c6543', '72617b6d-582a-434f-b380-bc76d6691b2c', 'Krishna Chy', '9841317273', '342123', 'Talchhikhel,Satdobato,Nepal', 'rider', 12, '6280229c-0178-4a26-8834-364d0ac23b4c', '', 12000.00, '2026-02-22', true, NULL, '2026-02-22 09:27:12.679764+00', '2026-02-22 09:27:12.679764+00'),
	('8bac98b8-ff64-419f-b6ae-2ee53255c770', '72617b6d-582a-434f-b380-bc76d6691b2c', 'Krishna Chy', '9841317273', '342123', 'Talchhikhel,Satdobato,Nepal', 'rider', 12, '6280229c-0178-4a26-8834-364d0ac23b4c', '12', 12000.00, '2026-02-22', true, NULL, '2026-02-22 09:32:29.748426+00', '2026-02-22 09:32:29.748426+00'),
	('a8ca10ef-691b-48e5-b166-95b87dee2b00', '72617b6d-582a-434f-b380-bc76d6691b2c', 'Shivam Nepal', '9810128705', '43234', 'Sinamangal', 'Farming', 5, '6280229c-0178-4a26-8834-364d0ac23b4c', '10', 4500.00, '2026-02-22', true, NULL, '2026-02-22 09:33:40.914806+00', '2026-02-22 09:33:40.914806+00');


--
-- Data for Name: monthly_billing; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."monthly_billing" ("id", "user_id", "tenant_id", "house_id", "billing_month", "billing_year", "rent_amount", "water_bill_type", "water_fixed_amount", "water_units", "water_rate", "electricity_bill_type", "electricity_fixed_amount", "electricity_units", "electricity_rate", "sanitation_charge", "extra_charges", "total_amount", "paid_amount", "payment_status", "payment_date", "payment_mode", "created_at", "updated_at", "previous_month_dues") VALUES
	('770490fa-161d-418b-93d4-5d72b82a2154', 'cd8486c1-b5ed-4874-b525-6c5413215291', 'ba65bcc9-4a7d-4b94-a55e-4165538c8d5c', '6bee4a93-e3ec-4f51-8e41-3a3379af9bd7', 2, 2026, 4500.00, 'fixed', 0.00, 0.00, 0.00, 'fixed', 0.00, 0.00, 0.00, 0.00, '[]', 4500.00, 0.00, 'unpaid', NULL, 'cash', '2026-02-21 15:05:55.090276+00', '2026-02-21 15:05:55.090276+00', 0.00),
	('6830dee4-1b52-4144-ba3f-5efafb905dd1', '72617b6d-582a-434f-b380-bc76d6691b2c', 'a8ca10ef-691b-48e5-b166-95b87dee2b00', '6280229c-0178-4a26-8834-364d0ac23b4c', 2, 2026, 4500.00, 'fixed', 200.00, 0.00, 0.00, 'fixed', 200.00, 0.00, 0.00, 200.00, '[]', 5100.00, 3000.00, 'partial', NULL, 'cash', '2026-02-22 09:34:29.109155+00', '2026-02-22 09:34:29.109155+00', 0.00);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 7, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict 9CuvxjDqzpYF3waAGLWtcx26wUEdi1jJq9btGfWnxaoZa0BsaIDB6bOlSGruLRX

RESET ALL;
