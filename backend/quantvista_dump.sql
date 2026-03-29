--
-- PostgreSQL database dump
--

\restrict KhK9H9Pz0AvRo5BFUtqK5ZB3XMfKKGt2QQ7pOJVd6SiWoPTwrIKOXdBCpgibRMS

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

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

ALTER TABLE IF EXISTS ONLY public.trading_transaction DROP CONSTRAINT IF EXISTS trading_transaction_user_id_c7611efd_fk_accounts_user_id;
ALTER TABLE IF EXISTS ONLY public.trading_transaction DROP CONSTRAINT IF EXISTS trading_transaction_stock_id_f24f78e6_fk_stocks_stock_id;
ALTER TABLE IF EXISTS ONLY public.trading_transaction DROP CONSTRAINT IF EXISTS trading_transaction_portfolio_id_f6bdebbd_fk_portfolio;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_outstandingtoken DROP CONSTRAINT IF EXISTS token_blacklist_outs_user_id_83bc629a_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_blacklistedtoken DROP CONSTRAINT IF EXISTS token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk;
ALTER TABLE IF EXISTS ONLY public.stocks_stockprice DROP CONSTRAINT IF EXISTS stocks_price_stock_id_0ec3929e_fk_stocks_stock_id;
ALTER TABLE IF EXISTS ONLY public.stocks_fundamental DROP CONSTRAINT IF EXISTS stocks_fundamental_stock_id_e43c72e0_fk_stocks_stock_id;
ALTER TABLE IF EXISTS ONLY public.socialaccount_socialaccount DROP CONSTRAINT IF EXISTS socialaccount_social_user_id_8146e70c_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.socialaccount_socialapp_sites DROP CONSTRAINT IF EXISTS socialaccount_social_socialapp_id_97fb6e7d_fk_socialacc;
ALTER TABLE IF EXISTS ONLY public.socialaccount_socialapp_sites DROP CONSTRAINT IF EXISTS socialaccount_social_site_id_2579dee5_fk_django_si;
ALTER TABLE IF EXISTS ONLY public.socialaccount_socialtoken DROP CONSTRAINT IF EXISTS socialaccount_social_app_id_636a42d7_fk_socialacc;
ALTER TABLE IF EXISTS ONLY public.socialaccount_socialtoken DROP CONSTRAINT IF EXISTS socialaccount_social_account_id_951f210e_fk_socialacc;
ALTER TABLE IF EXISTS ONLY public.portfolio_portfoliostock DROP CONSTRAINT IF EXISTS portfolio_portfoliostock_stock_id_d5b91619_fk_stocks_stock_id;
ALTER TABLE IF EXISTS ONLY public.portfolio_portfoliostock DROP CONSTRAINT IF EXISTS portfolio_portfolios_portfolio_id_dcea0927_fk_portfolio;
ALTER TABLE IF EXISTS ONLY public.portfolio_portfolio DROP CONSTRAINT IF EXISTS portfolio_portfolio_user_id_91731826_fk_accounts_user_id;
ALTER TABLE IF EXISTS ONLY public.portfolio_holding DROP CONSTRAINT IF EXISTS portfolio_holding_stock_id_fkey;
ALTER TABLE IF EXISTS ONLY public.portfolio_holding DROP CONSTRAINT IF EXISTS portfolio_holding_portfolio_id_fkey;
ALTER TABLE IF EXISTS ONLY public.otp_otp DROP CONSTRAINT IF EXISTS otp_otp_user_id_fe9d6c52_fk_accounts_user_id;
ALTER TABLE IF EXISTS ONLY public.mlops_stockcluster DROP CONSTRAINT IF EXISTS mlops_stockcluster_stock_id_cb23487b_fk_stocks_stock_id;
ALTER TABLE IF EXISTS ONLY public.mlops_stockcluster DROP CONSTRAINT IF EXISTS mlops_stockcluster_portfolio_id_11ab9cc1_fk_portfolio;
ALTER TABLE IF EXISTS ONLY public.mlops_stockcluster DROP CONSTRAINT IF EXISTS mlops_stockcluster_created_by_id_b7dccc66_fk_accounts_user_id;
ALTER TABLE IF EXISTS ONLY public.mlops_predictionrun DROP CONSTRAINT IF EXISTS mlops_predictionrun_stock_id_5490ce83_fk_stocks_stock_id;
ALTER TABLE IF EXISTS ONLY public.mlops_predictionrun DROP CONSTRAINT IF EXISTS mlops_predictionrun_created_by_id_270b3af6_fk_accounts_user_id;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_user_id_c564eba6_fk_accounts_user_id;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_content_type_id_c4bce8eb_fk_django_co;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_content_type_id_2f476e4b_fk_django_co;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_group_id_b120cbf9_fk_auth_group_id;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissio_permission_id_84c5c92e_fk_auth_perm;
ALTER TABLE IF EXISTS ONLY public.accounts_user_user_permissions DROP CONSTRAINT IF EXISTS accounts_user_user_p_user_id_e4f0a161_fk_accounts_;
ALTER TABLE IF EXISTS ONLY public.accounts_user_user_permissions DROP CONSTRAINT IF EXISTS accounts_user_user_p_permission_id_113bb443_fk_auth_perm;
ALTER TABLE IF EXISTS ONLY public.accounts_user_groups DROP CONSTRAINT IF EXISTS accounts_user_groups_user_id_52b62117_fk_accounts_user_id;
ALTER TABLE IF EXISTS ONLY public.accounts_user_groups DROP CONSTRAINT IF EXISTS accounts_user_groups_group_id_bd11a704_fk_auth_group_id;
ALTER TABLE IF EXISTS ONLY public.account_emailconfirmation DROP CONSTRAINT IF EXISTS account_emailconfirm_email_address_id_5b7f8c58_fk_account_e;
ALTER TABLE IF EXISTS ONLY public.account_emailaddress DROP CONSTRAINT IF EXISTS account_emailaddress_user_id_2c513194_fk_accounts_user_id;
DROP INDEX IF EXISTS public.unique_verified_email;
DROP INDEX IF EXISTS public.unique_user_portfolio_name;
DROP INDEX IF EXISTS public.unique_primary_email;
DROP INDEX IF EXISTS public.trading_transaction_user_id_c7611efd;
DROP INDEX IF EXISTS public.trading_transaction_stock_id_f24f78e6;
DROP INDEX IF EXISTS public.trading_transaction_portfolio_id_f6bdebbd;
DROP INDEX IF EXISTS public.token_blacklist_outstandingtoken_user_id_83bc629a;
DROP INDEX IF EXISTS public.token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like;
DROP INDEX IF EXISTS public.stocks_stock_symbol_e2aab713_like;
DROP INDEX IF EXISTS public.stocks_price_timestamp_817d435e;
DROP INDEX IF EXISTS public.stocks_price_stock_id_0ec3929e;
DROP INDEX IF EXISTS public.socialaccount_socialtoken_app_id_636a42d7;
DROP INDEX IF EXISTS public.socialaccount_socialtoken_account_id_951f210e;
DROP INDEX IF EXISTS public.socialaccount_socialapp_sites_socialapp_id_97fb6e7d;
DROP INDEX IF EXISTS public.socialaccount_socialapp_sites_site_id_2579dee5;
DROP INDEX IF EXISTS public.socialaccount_socialaccount_user_id_8146e70c;
DROP INDEX IF EXISTS public.portfolio_portfoliostock_stock_id_d5b91619;
DROP INDEX IF EXISTS public.portfolio_portfoliostock_portfolio_id_dcea0927;
DROP INDEX IF EXISTS public.portfolio_portfolio_user_id_91731826;
DROP INDEX IF EXISTS public.otp_otp_user_id_fe9d6c52;
DROP INDEX IF EXISTS public.mlops_stockcluster_stock_id_cb23487b;
DROP INDEX IF EXISTS public.mlops_stockcluster_portfolio_id_11ab9cc1;
DROP INDEX IF EXISTS public.mlops_stockcluster_created_by_id_b7dccc66;
DROP INDEX IF EXISTS public.mlops_predictionrun_stock_id_5490ce83;
DROP INDEX IF EXISTS public.mlops_predictionrun_created_by_id_270b3af6;
DROP INDEX IF EXISTS public.insights_marketstocksnapshot_symbol_f017feda_like;
DROP INDEX IF EXISTS public.insights_marketstocksnapshot_market_1df416e9_like;
DROP INDEX IF EXISTS public.insights_marketstocksnapshot_market_1df416e9;
DROP INDEX IF EXISTS public.django_site_domain_a2e37b91_like;
DROP INDEX IF EXISTS public.django_session_session_key_c0390e0f_like;
DROP INDEX IF EXISTS public.django_session_expire_date_a5c62663;
DROP INDEX IF EXISTS public.django_admin_log_user_id_c564eba6;
DROP INDEX IF EXISTS public.django_admin_log_content_type_id_c4bce8eb;
DROP INDEX IF EXISTS public.auth_permission_content_type_id_2f476e4b;
DROP INDEX IF EXISTS public.auth_group_permissions_permission_id_84c5c92e;
DROP INDEX IF EXISTS public.auth_group_permissions_group_id_b120cbf9;
DROP INDEX IF EXISTS public.auth_group_name_a6ea08ec_like;
DROP INDEX IF EXISTS public.accounts_user_username_6088629e_like;
DROP INDEX IF EXISTS public.accounts_user_user_permissions_user_id_e4f0a161;
DROP INDEX IF EXISTS public.accounts_user_user_permissions_permission_id_113bb443;
DROP INDEX IF EXISTS public.accounts_user_groups_user_id_52b62117;
DROP INDEX IF EXISTS public.accounts_user_groups_group_id_bd11a704;
DROP INDEX IF EXISTS public.accounts_user_google_sub_8c9d6bcc_like;
DROP INDEX IF EXISTS public.accounts_user_email_b2644a56_like;
DROP INDEX IF EXISTS public.account_emailconfirmation_key_f43612bd_like;
DROP INDEX IF EXISTS public.account_emailconfirmation_email_address_id_5b7f8c58;
DROP INDEX IF EXISTS public.account_emailaddress_user_id_2c513194;
DROP INDEX IF EXISTS public.account_emailaddress_email_03be32b2_like;
DROP INDEX IF EXISTS public.account_emailaddress_email_03be32b2;
ALTER TABLE IF EXISTS ONLY public.trading_transaction DROP CONSTRAINT IF EXISTS trading_transaction_pkey;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_outstandingtoken DROP CONSTRAINT IF EXISTS token_blacklist_outstandingtoken_pkey;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_outstandingtoken DROP CONSTRAINT IF EXISTS token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_blacklistedtoken DROP CONSTRAINT IF EXISTS token_blacklist_blacklistedtoken_token_id_key;
ALTER TABLE IF EXISTS ONLY public.token_blacklist_blacklistedtoken DROP CONSTRAINT IF EXISTS token_blacklist_blacklistedtoken_pkey;
ALTER TABLE IF EXISTS ONLY public.stocks_stockmaster DROP CONSTRAINT IF EXISTS stocks_stock_symbol_key;
ALTER TABLE IF EXISTS ONLY public.stocks_stockmaster DROP CONSTRAINT IF EXISTS stocks_stock_pkey;
ALTER TABLE IF EXISTS ONLY public.stocks_stockprice DROP CONSTRAINT IF EXISTS stocks_price_stock_id_timestamp_00ab44b9_uniq;
ALTER TABLE IF EXISTS ONLY public.stocks_stockprice DROP CONSTRAINT IF EXISTS stocks_price_pkey;
ALTER TABLE IF EXISTS ONLY public.stocks_fundamental DROP CONSTRAINT IF EXISTS stocks_fundamental_stock_id_key;
ALTER TABLE IF EXISTS ONLY public.stocks_fundamental DROP CONSTRAINT IF EXISTS stocks_fundamental_pkey;
ALTER TABLE IF EXISTS ONLY public.socialaccount_socialtoken DROP CONSTRAINT IF EXISTS socialaccount_socialtoken_pkey;
ALTER TABLE IF EXISTS ONLY public.socialaccount_socialtoken DROP CONSTRAINT IF EXISTS socialaccount_socialtoken_app_id_account_id_fca4e0ac_uniq;
ALTER TABLE IF EXISTS ONLY public.socialaccount_socialapp_sites DROP CONSTRAINT IF EXISTS socialaccount_socialapp_sites_pkey;
ALTER TABLE IF EXISTS ONLY public.socialaccount_socialapp DROP CONSTRAINT IF EXISTS socialaccount_socialapp_pkey;
ALTER TABLE IF EXISTS ONLY public.socialaccount_socialapp_sites DROP CONSTRAINT IF EXISTS socialaccount_socialapp__socialapp_id_site_id_71a9a768_uniq;
ALTER TABLE IF EXISTS ONLY public.socialaccount_socialaccount DROP CONSTRAINT IF EXISTS socialaccount_socialaccount_provider_uid_fc810c6e_uniq;
ALTER TABLE IF EXISTS ONLY public.socialaccount_socialaccount DROP CONSTRAINT IF EXISTS socialaccount_socialaccount_pkey;
ALTER TABLE IF EXISTS ONLY public.portfolio_portfoliostock DROP CONSTRAINT IF EXISTS portfolio_portfoliostock_portfolio_id_stock_id_2162e702_uniq;
ALTER TABLE IF EXISTS ONLY public.portfolio_portfoliostock DROP CONSTRAINT IF EXISTS portfolio_portfoliostock_pkey;
ALTER TABLE IF EXISTS ONLY public.portfolio_portfolio DROP CONSTRAINT IF EXISTS portfolio_portfolio_pkey;
ALTER TABLE IF EXISTS ONLY public.portfolio_holding DROP CONSTRAINT IF EXISTS portfolio_holding_portfolio_id_stock_id_key;
ALTER TABLE IF EXISTS ONLY public.portfolio_holding DROP CONSTRAINT IF EXISTS portfolio_holding_pkey;
ALTER TABLE IF EXISTS ONLY public.otp_otp DROP CONSTRAINT IF EXISTS otp_otp_pkey;
ALTER TABLE IF EXISTS ONLY public.mlops_stockcluster DROP CONSTRAINT IF EXISTS mlops_stockcluster_portfolio_id_stock_id_a4d6d1d7_uniq;
ALTER TABLE IF EXISTS ONLY public.mlops_stockcluster DROP CONSTRAINT IF EXISTS mlops_stockcluster_pkey;
ALTER TABLE IF EXISTS ONLY public.mlops_predictionrun DROP CONSTRAINT IF EXISTS mlops_predictionrun_pkey;
ALTER TABLE IF EXISTS ONLY public.insights_marketstocksnapshot DROP CONSTRAINT IF EXISTS insights_marketstocksnapshot_symbol_key;
ALTER TABLE IF EXISTS ONLY public.insights_marketstocksnapshot DROP CONSTRAINT IF EXISTS insights_marketstocksnapshot_pkey;
ALTER TABLE IF EXISTS ONLY public.django_site DROP CONSTRAINT IF EXISTS django_site_pkey;
ALTER TABLE IF EXISTS ONLY public.django_site DROP CONSTRAINT IF EXISTS django_site_domain_a2e37b91_uniq;
ALTER TABLE IF EXISTS ONLY public.django_session DROP CONSTRAINT IF EXISTS django_session_pkey;
ALTER TABLE IF EXISTS ONLY public.django_migrations DROP CONSTRAINT IF EXISTS django_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public.django_content_type DROP CONSTRAINT IF EXISTS django_content_type_pkey;
ALTER TABLE IF EXISTS ONLY public.django_content_type DROP CONSTRAINT IF EXISTS django_content_type_app_label_model_76bd3d3b_uniq;
ALTER TABLE IF EXISTS ONLY public.django_admin_log DROP CONSTRAINT IF EXISTS django_admin_log_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_permission DROP CONSTRAINT IF EXISTS auth_permission_content_type_id_codename_01ab375a_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_group DROP CONSTRAINT IF EXISTS auth_group_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.auth_group_permissions DROP CONSTRAINT IF EXISTS auth_group_permissions_group_id_permission_id_0cd325b0_uniq;
ALTER TABLE IF EXISTS ONLY public.auth_group DROP CONSTRAINT IF EXISTS auth_group_name_key;
ALTER TABLE IF EXISTS ONLY public.accounts_user DROP CONSTRAINT IF EXISTS accounts_user_username_key;
ALTER TABLE IF EXISTS ONLY public.accounts_user_user_permissions DROP CONSTRAINT IF EXISTS accounts_user_user_permissions_pkey;
ALTER TABLE IF EXISTS ONLY public.accounts_user_user_permissions DROP CONSTRAINT IF EXISTS accounts_user_user_permi_user_id_permission_id_2ab516c2_uniq;
ALTER TABLE IF EXISTS ONLY public.accounts_user DROP CONSTRAINT IF EXISTS accounts_user_pkey;
ALTER TABLE IF EXISTS ONLY public.accounts_user_groups DROP CONSTRAINT IF EXISTS accounts_user_groups_user_id_group_id_59c0b32f_uniq;
ALTER TABLE IF EXISTS ONLY public.accounts_user_groups DROP CONSTRAINT IF EXISTS accounts_user_groups_pkey;
ALTER TABLE IF EXISTS ONLY public.accounts_user DROP CONSTRAINT IF EXISTS accounts_user_google_sub_key;
ALTER TABLE IF EXISTS ONLY public.accounts_user DROP CONSTRAINT IF EXISTS accounts_user_email_key;
ALTER TABLE IF EXISTS ONLY public.account_emailconfirmation DROP CONSTRAINT IF EXISTS account_emailconfirmation_pkey;
ALTER TABLE IF EXISTS ONLY public.account_emailconfirmation DROP CONSTRAINT IF EXISTS account_emailconfirmation_key_key;
ALTER TABLE IF EXISTS ONLY public.account_emailaddress DROP CONSTRAINT IF EXISTS account_emailaddress_user_id_email_987c8728_uniq;
ALTER TABLE IF EXISTS ONLY public.account_emailaddress DROP CONSTRAINT IF EXISTS account_emailaddress_pkey;
ALTER TABLE IF EXISTS public.portfolio_holding ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS public.trading_transaction;
DROP TABLE IF EXISTS public.token_blacklist_outstandingtoken;
DROP TABLE IF EXISTS public.token_blacklist_blacklistedtoken;
DROP TABLE IF EXISTS public.stocks_stockmaster;
DROP TABLE IF EXISTS public.stocks_stockprice;
DROP TABLE IF EXISTS public.stocks_fundamental;
DROP TABLE IF EXISTS public.socialaccount_socialtoken;
DROP TABLE IF EXISTS public.socialaccount_socialapp_sites;
DROP TABLE IF EXISTS public.socialaccount_socialapp;
DROP TABLE IF EXISTS public.socialaccount_socialaccount;
DROP TABLE IF EXISTS public.portfolio_portfoliostock;
DROP TABLE IF EXISTS public.portfolio_portfolio;
DROP SEQUENCE IF EXISTS public.portfolio_holding_id_seq;
DROP TABLE IF EXISTS public.portfolio_holding;
DROP TABLE IF EXISTS public.otp_otp;
DROP TABLE IF EXISTS public.mlops_stockcluster;
DROP TABLE IF EXISTS public.mlops_predictionrun;
DROP TABLE IF EXISTS public.insights_marketstocksnapshot;
DROP TABLE IF EXISTS public.django_site;
DROP TABLE IF EXISTS public.django_session;
DROP TABLE IF EXISTS public.django_migrations;
DROP TABLE IF EXISTS public.django_content_type;
DROP TABLE IF EXISTS public.django_admin_log;
DROP TABLE IF EXISTS public.auth_permission;
DROP TABLE IF EXISTS public.auth_group_permissions;
DROP TABLE IF EXISTS public.auth_group;
DROP TABLE IF EXISTS public.accounts_user_user_permissions;
DROP TABLE IF EXISTS public.accounts_user_groups;
DROP TABLE IF EXISTS public.accounts_user;
DROP TABLE IF EXISTS public.account_emailconfirmation;
DROP TABLE IF EXISTS public.account_emailaddress;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account_emailaddress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account_emailaddress (
    id integer NOT NULL,
    email character varying(254) NOT NULL,
    verified boolean NOT NULL,
    "primary" boolean NOT NULL,
    user_id bigint NOT NULL
);


--
-- Name: account_emailaddress_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.account_emailaddress ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.account_emailaddress_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: account_emailconfirmation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account_emailconfirmation (
    id integer NOT NULL,
    created timestamp with time zone NOT NULL,
    sent timestamp with time zone,
    key character varying(64) NOT NULL,
    email_address_id integer NOT NULL
);


--
-- Name: account_emailconfirmation_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.account_emailconfirmation ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.account_emailconfirmation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: accounts_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts_user (
    id bigint NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    first_name character varying(150) NOT NULL,
    last_name character varying(150) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL,
    username character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    mpin_hash character varying(128) NOT NULL,
    telegram_username character varying(255) NOT NULL,
    telegram_chat_id character varying(64) NOT NULL,
    otp_code character varying(10) NOT NULL,
    otp_created_at timestamp with time zone,
    otp_attempts integer NOT NULL,
    otp_request_count integer NOT NULL,
    otp_request_window_start timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    google_sub character varying(255),
    telegram_link_code character varying(16) NOT NULL,
    telegram_link_code_created_at timestamp with time zone,
    CONSTRAINT accounts_user_otp_attempts_check CHECK ((otp_attempts >= 0)),
    CONSTRAINT accounts_user_otp_request_count_check CHECK ((otp_request_count >= 0))
);


--
-- Name: accounts_user_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts_user_groups (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    group_id integer NOT NULL
);


--
-- Name: accounts_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.accounts_user_groups ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.accounts_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: accounts_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.accounts_user ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.accounts_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: accounts_user_user_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts_user_user_permissions (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    permission_id integer NOT NULL
);


--
-- Name: accounts_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.accounts_user_user_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.accounts_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_group ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_group_permissions (
    id bigint NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_group_permissions ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.auth_permission ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.auth_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id bigint NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_admin_log ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_admin_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_content_type ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_content_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_migrations (
    id bigint NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_migrations ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


--
-- Name: django_site; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.django_site (
    id integer NOT NULL,
    domain character varying(100) NOT NULL,
    name character varying(50) NOT NULL
);


--
-- Name: django_site_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.django_site ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.django_site_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: insights_marketstocksnapshot; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.insights_marketstocksnapshot (
    id bigint NOT NULL,
    symbol character varying(20) NOT NULL,
    name character varying(255) NOT NULL,
    sector character varying(100) NOT NULL,
    market character varying(2) NOT NULL,
    market_price double precision NOT NULL,
    day_change double precision NOT NULL,
    day_change_pct double precision NOT NULL,
    volume bigint NOT NULL,
    market_cap double precision NOT NULL,
    data_source character varying(32) NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


--
-- Name: insights_marketstocksnapshot_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.insights_marketstocksnapshot ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.insights_marketstocksnapshot_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: mlops_predictionrun; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mlops_predictionrun (
    id bigint NOT NULL,
    model_type character varying(40) NOT NULL,
    prediction double precision NOT NULL,
    metrics jsonb NOT NULL,
    mlflow_run_id character varying(128) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    created_by_id bigint,
    stock_id bigint NOT NULL
);


--
-- Name: mlops_predictionrun_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.mlops_predictionrun ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.mlops_predictionrun_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: mlops_stockcluster; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mlops_stockcluster (
    id bigint NOT NULL,
    cluster_label integer NOT NULL,
    feature_vector jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL,
    created_by_id bigint,
    stock_id bigint NOT NULL,
    portfolio_id bigint
);


--
-- Name: mlops_stockcluster_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.mlops_stockcluster ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.mlops_stockcluster_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: otp_otp; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.otp_otp (
    id bigint NOT NULL,
    code character varying(6) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    is_used boolean NOT NULL,
    user_id bigint NOT NULL
);


--
-- Name: otp_otp_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.otp_otp ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.otp_otp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: portfolio_holding; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.portfolio_holding (
    id bigint NOT NULL,
    portfolio_id bigint NOT NULL,
    stock_id bigint NOT NULL,
    quantity numeric(18,4) DEFAULT 0 NOT NULL,
    average_buy_price numeric(18,4) DEFAULT 0 NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: portfolio_holding_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.portfolio_holding_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: portfolio_holding_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.portfolio_holding_id_seq OWNED BY public.portfolio_holding.id;


--
-- Name: portfolio_portfolio; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.portfolio_portfolio (
    id bigint NOT NULL,
    name character varying(120) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    user_id bigint,
    description text,
    is_default boolean NOT NULL,
    sector character varying(100),
    is_automated boolean NOT NULL,
    target_allocation jsonb NOT NULL
);


--
-- Name: portfolio_portfolio_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.portfolio_portfolio ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.portfolio_portfolio_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: portfolio_portfoliostock; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.portfolio_portfoliostock (
    id bigint NOT NULL,
    quantity numeric(14,4) NOT NULL,
    average_buy_price numeric(14,2) NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    portfolio_id bigint NOT NULL,
    stock_id bigint NOT NULL
);


--
-- Name: portfolio_portfoliostock_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.portfolio_portfoliostock ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.portfolio_portfoliostock_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: socialaccount_socialaccount; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.socialaccount_socialaccount (
    id integer NOT NULL,
    provider character varying(200) NOT NULL,
    uid character varying(191) NOT NULL,
    last_login timestamp with time zone NOT NULL,
    date_joined timestamp with time zone NOT NULL,
    extra_data jsonb NOT NULL,
    user_id bigint NOT NULL
);


--
-- Name: socialaccount_socialaccount_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.socialaccount_socialaccount ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.socialaccount_socialaccount_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: socialaccount_socialapp; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.socialaccount_socialapp (
    id integer NOT NULL,
    provider character varying(30) NOT NULL,
    name character varying(40) NOT NULL,
    client_id character varying(191) NOT NULL,
    secret character varying(191) NOT NULL,
    key character varying(191) NOT NULL,
    provider_id character varying(200) NOT NULL,
    settings jsonb NOT NULL
);


--
-- Name: socialaccount_socialapp_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.socialaccount_socialapp ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.socialaccount_socialapp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: socialaccount_socialapp_sites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.socialaccount_socialapp_sites (
    id bigint NOT NULL,
    socialapp_id integer NOT NULL,
    site_id integer NOT NULL
);


--
-- Name: socialaccount_socialapp_sites_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.socialaccount_socialapp_sites ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.socialaccount_socialapp_sites_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: socialaccount_socialtoken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.socialaccount_socialtoken (
    id integer NOT NULL,
    token text NOT NULL,
    token_secret text NOT NULL,
    expires_at timestamp with time zone,
    account_id integer NOT NULL,
    app_id integer
);


--
-- Name: socialaccount_socialtoken_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.socialaccount_socialtoken ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.socialaccount_socialtoken_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: stocks_fundamental; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stocks_fundamental (
    id bigint NOT NULL,
    pe_ratio numeric(12,2),
    roe numeric(8,2),
    market_cap numeric(20,2),
    updated_at timestamp with time zone NOT NULL,
    stock_id bigint NOT NULL
);


--
-- Name: stocks_fundamental_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.stocks_fundamental ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.stocks_fundamental_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: stocks_stockprice; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stocks_stockprice (
    id bigint CONSTRAINT stocks_price_id_not_null NOT NULL,
    "timestamp" timestamp with time zone CONSTRAINT stocks_price_timestamp_not_null NOT NULL,
    open numeric(12,2) CONSTRAINT stocks_price_open_not_null NOT NULL,
    high numeric(12,2) CONSTRAINT stocks_price_high_not_null NOT NULL,
    low numeric(12,2) CONSTRAINT stocks_price_low_not_null NOT NULL,
    close numeric(12,2) CONSTRAINT stocks_price_close_not_null NOT NULL,
    volume bigint CONSTRAINT stocks_price_volume_not_null NOT NULL,
    stock_id bigint CONSTRAINT stocks_price_stock_id_not_null NOT NULL
);


--
-- Name: stocks_price_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.stocks_stockprice ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.stocks_price_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: stocks_stockmaster; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stocks_stockmaster (
    id bigint CONSTRAINT stocks_stock_id_not_null NOT NULL,
    symbol character varying(20) CONSTRAINT stocks_stock_symbol_not_null NOT NULL,
    name character varying(255) CONSTRAINT stocks_stock_name_not_null NOT NULL,
    sector character varying(100) CONSTRAINT stocks_stock_sector_not_null NOT NULL,
    high_52week numeric(12,2),
    low_52week numeric(12,2),
    pe_ratio numeric(12,2),
    market character varying(20) DEFAULT 'NSE'::character varying NOT NULL
);


--
-- Name: stocks_stock_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.stocks_stockmaster ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.stocks_stock_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: token_blacklist_blacklistedtoken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.token_blacklist_blacklistedtoken (
    id bigint NOT NULL,
    blacklisted_at timestamp with time zone NOT NULL,
    token_id bigint NOT NULL
);


--
-- Name: token_blacklist_blacklistedtoken_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.token_blacklist_blacklistedtoken ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.token_blacklist_blacklistedtoken_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: token_blacklist_outstandingtoken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.token_blacklist_outstandingtoken (
    id bigint NOT NULL,
    token text NOT NULL,
    created_at timestamp with time zone,
    expires_at timestamp with time zone NOT NULL,
    user_id bigint,
    jti character varying(255) CONSTRAINT token_blacklist_outstandingtoken_jti_hex_not_null NOT NULL
);


--
-- Name: token_blacklist_outstandingtoken_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.token_blacklist_outstandingtoken ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.token_blacklist_outstandingtoken_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: trading_transaction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.trading_transaction (
    id bigint NOT NULL,
    side character varying(4) NOT NULL,
    quantity numeric(14,4) NOT NULL,
    price numeric(14,2) NOT NULL,
    executed_at timestamp with time zone NOT NULL,
    portfolio_id bigint NOT NULL,
    stock_id bigint NOT NULL,
    user_id bigint NOT NULL
);


--
-- Name: trading_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.trading_transaction ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.trading_transaction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: portfolio_holding id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_holding ALTER COLUMN id SET DEFAULT nextval('public.portfolio_holding_id_seq'::regclass);


--
-- Data for Name: account_emailaddress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.account_emailaddress (id, email, verified, "primary", user_id) FROM stdin;
\.


--
-- Data for Name: account_emailconfirmation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.account_emailconfirmation (id, created, sent, key, email_address_id) FROM stdin;
\.


--
-- Data for Name: accounts_user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.accounts_user (id, password, last_login, is_superuser, first_name, last_name, is_staff, is_active, date_joined, username, email, mpin_hash, telegram_username, telegram_chat_id, otp_code, otp_created_at, otp_attempts, otp_request_count, otp_request_window_start, created_at, google_sub, telegram_link_code, telegram_link_code_created_at) FROM stdin;
1	pbkdf2_sha256$870000$gT1uFipDPRIPoKBRoRfOLw$2cvcnCp47tB+/NblF+8Pqkywq9dCne0+WUDoCss89z4=	\N	f	Girija	Zirange	f	t	2026-03-23 15:49:31.221868+05:30	girijazirange@gmail.com	girijazirange@gmail.com	pbkdf2_sha256$870000$3x3LzOuMMqNrdsvgIjzwZB$XfveiFaif7Ek4q++UMy4nHD/Oa8ER/OyUWWdFuQ+BBI=				\N	0	0	\N	2026-03-23 15:49:31.221868+05:30	\N	F6Z3D2KK	2026-03-24 11:19:40.56773+05:30
2	pbkdf2_sha256$870000$rDJMn5qHrce4tS6rXxcZQx$QRLflYAt4fez37ZCaWz8eRoQigs2mYQtU1hteP8o998=	\N	f			f	t	2026-03-26 16:16:16.629043+05:30	girija	gir@gmail.com		xyz1797	xyz1797	831217	2026-03-26 16:17:52.278403+05:30	0	1	2026-03-26 16:17:52.278403+05:30	2026-03-26 16:16:16.629043+05:30	\N		\N
17	pbkdf2_sha256$870000$5UrSmQlQ7ZdbytZHxjywX4$0LO8BaXJTwTFLKnU9Ygu1K1/uI6E+mD0fmvcY8vST9Y=	\N	f	Test		f	t	2026-03-29 18:02:03.488489+05:30	test_chat@test.com	test_chat@test.com		unlinked_8a4919eb58fc	unlinked_8a4919eb58fc		\N	0	0	\N	2026-03-29 18:02:03.488489+05:30	\N		\N
18	pbkdf2_sha256$870000$aPx2j2lZB8H9nFma5GwXui$pjbufNMzUmTQJAtLgiGp/NoTfzU1k2D6HQlPKpfaXDQ=	\N	f	Diksha	Malusare	f	t	2026-03-29 18:09:12.773335+05:30	dikshamalusare@gmail.com	dikshamalusare@gmail.com		unlinked_5729ef8de717	unlinked_5729ef8de717		\N	0	0	\N	2026-03-29 18:09:12.773335+05:30	\N		\N
\.


--
-- Data for Name: accounts_user_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.accounts_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- Data for Name: accounts_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.accounts_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add log entry	1	add_logentry
2	Can change log entry	1	change_logentry
3	Can delete log entry	1	delete_logentry
4	Can view log entry	1	view_logentry
5	Can add permission	2	add_permission
6	Can change permission	2	change_permission
7	Can delete permission	2	delete_permission
8	Can view permission	2	view_permission
9	Can add group	3	add_group
10	Can change group	3	change_group
11	Can delete group	3	delete_group
12	Can view group	3	view_group
13	Can add content type	4	add_contenttype
14	Can change content type	4	change_contenttype
15	Can delete content type	4	delete_contenttype
16	Can view content type	4	view_contenttype
17	Can add session	5	add_session
18	Can change session	5	change_session
19	Can delete session	5	delete_session
20	Can view session	5	view_session
21	Can add site	6	add_site
22	Can change site	6	change_site
23	Can delete site	6	delete_site
24	Can view site	6	view_site
25	Can add blacklisted token	7	add_blacklistedtoken
26	Can change blacklisted token	7	change_blacklistedtoken
27	Can delete blacklisted token	7	delete_blacklistedtoken
28	Can view blacklisted token	7	view_blacklistedtoken
29	Can add outstanding token	8	add_outstandingtoken
30	Can change outstanding token	8	change_outstandingtoken
31	Can delete outstanding token	8	delete_outstandingtoken
32	Can view outstanding token	8	view_outstandingtoken
33	Can add email address	9	add_emailaddress
34	Can change email address	9	change_emailaddress
35	Can delete email address	9	delete_emailaddress
36	Can view email address	9	view_emailaddress
37	Can add email confirmation	10	add_emailconfirmation
38	Can change email confirmation	10	change_emailconfirmation
39	Can delete email confirmation	10	delete_emailconfirmation
40	Can view email confirmation	10	view_emailconfirmation
41	Can add social account	11	add_socialaccount
42	Can change social account	11	change_socialaccount
43	Can delete social account	11	delete_socialaccount
44	Can view social account	11	view_socialaccount
45	Can add social application	12	add_socialapp
46	Can change social application	12	change_socialapp
47	Can delete social application	12	delete_socialapp
48	Can view social application	12	view_socialapp
49	Can add social application token	13	add_socialtoken
50	Can change social application token	13	change_socialtoken
51	Can delete social application token	13	delete_socialtoken
52	Can view social application token	13	view_socialtoken
53	Can add user	14	add_user
54	Can change user	14	change_user
55	Can delete user	14	delete_user
56	Can view user	14	view_user
57	Can add stock	15	add_stock
58	Can change stock	15	change_stock
59	Can delete stock	15	delete_stock
60	Can view stock	15	view_stock
61	Can add fundamental	16	add_fundamental
62	Can change fundamental	16	change_fundamental
63	Can delete fundamental	16	delete_fundamental
64	Can view fundamental	16	view_fundamental
65	Can add price	17	add_price
66	Can change price	17	change_price
67	Can delete price	17	delete_price
68	Can view price	17	view_price
69	Can add portfolio	18	add_portfolio
70	Can change portfolio	18	change_portfolio
71	Can delete portfolio	18	delete_portfolio
72	Can view portfolio	18	view_portfolio
73	Can add portfolio stock	19	add_portfoliostock
74	Can change portfolio stock	19	change_portfoliostock
75	Can delete portfolio stock	19	delete_portfoliostock
76	Can view portfolio stock	19	view_portfoliostock
77	Can add transaction	20	add_transaction
78	Can change transaction	20	change_transaction
79	Can delete transaction	20	delete_transaction
80	Can view transaction	20	view_transaction
81	Can add prediction run	21	add_predictionrun
82	Can change prediction run	21	change_predictionrun
83	Can delete prediction run	21	delete_predictionrun
84	Can view prediction run	21	view_predictionrun
85	Can add stock cluster	22	add_stockcluster
86	Can change stock cluster	22	change_stockcluster
87	Can delete stock cluster	22	delete_stockcluster
88	Can view stock cluster	22	view_stockcluster
89	Can add market stock snapshot	23	add_marketstocksnapshot
90	Can change market stock snapshot	23	change_marketstocksnapshot
91	Can delete market stock snapshot	23	delete_marketstocksnapshot
92	Can view market stock snapshot	23	view_marketstocksnapshot
93	Can add stock master	24	add_stockmaster
94	Can change stock master	24	change_stockmaster
95	Can delete stock master	24	delete_stockmaster
96	Can view stock master	24	view_stockmaster
97	Can add stock price	25	add_stockprice
98	Can change stock price	25	change_stockprice
99	Can delete stock price	25	delete_stockprice
100	Can view stock price	25	view_stockprice
101	Can add transaction	26	add_transaction
102	Can change transaction	26	change_transaction
103	Can delete transaction	26	delete_transaction
104	Can view transaction	26	view_transaction
105	Can add holding	27	add_holding
106	Can change holding	27	change_holding
107	Can delete holding	27	delete_holding
108	Can view holding	27	view_holding
109	Can add otp	28	add_otp
110	Can change otp	28	change_otp
111	Can delete otp	28	delete_otp
112	Can view otp	28	view_otp
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	admin	logentry
2	auth	permission
3	auth	group
4	contenttypes	contenttype
5	sessions	session
6	sites	site
7	token_blacklist	blacklistedtoken
8	token_blacklist	outstandingtoken
9	account	emailaddress
10	account	emailconfirmation
11	socialaccount	socialaccount
12	socialaccount	socialapp
13	socialaccount	socialtoken
14	accounts	user
15	stocks	stock
16	stocks	fundamental
17	stocks	price
18	portfolio	portfolio
19	portfolio	portfoliostock
20	trading	transaction
21	mlops	predictionrun
22	mlops	stockcluster
23	insights	marketstocksnapshot
24	stocks	stockmaster
25	stocks	stockprice
26	portfolio	transaction
27	portfolio	holding
28	otp	otp
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2026-03-21 21:13:07.720743+05:30
2	contenttypes	0002_remove_content_type_name	2026-03-21 21:13:07.744333+05:30
3	auth	0001_initial	2026-03-21 21:13:07.814686+05:30
4	auth	0002_alter_permission_name_max_length	2026-03-21 21:13:07.829012+05:30
5	auth	0003_alter_user_email_max_length	2026-03-21 21:13:07.836543+05:30
6	auth	0004_alter_user_username_opts	2026-03-21 21:13:07.842064+05:30
7	auth	0005_alter_user_last_login_null	2026-03-21 21:13:07.849194+05:30
8	auth	0006_require_contenttypes_0002	2026-03-21 21:13:07.852193+05:30
9	auth	0007_alter_validators_add_error_messages	2026-03-21 21:13:07.857713+05:30
10	auth	0008_alter_user_username_max_length	2026-03-21 21:13:07.864192+05:30
11	auth	0009_alter_user_last_name_max_length	2026-03-21 21:13:07.872037+05:30
12	auth	0010_alter_group_name_max_length	2026-03-21 21:13:07.886591+05:30
13	auth	0011_update_proxy_permissions	2026-03-21 21:13:07.892677+05:30
14	auth	0012_alter_user_first_name_max_length	2026-03-21 21:13:07.899514+05:30
15	accounts	0001_initial	2026-03-21 21:13:07.984234+05:30
16	account	0001_initial	2026-03-21 21:13:08.05166+05:30
17	account	0002_email_max_length	2026-03-21 21:13:08.065249+05:30
18	account	0003_alter_emailaddress_create_unique_verified_email	2026-03-21 21:13:08.085894+05:30
19	account	0004_alter_emailaddress_drop_unique_email	2026-03-21 21:13:08.136021+05:30
20	account	0005_emailaddress_idx_upper_email	2026-03-21 21:13:08.160979+05:30
21	account	0006_emailaddress_lower	2026-03-21 21:13:08.181839+05:30
22	account	0007_emailaddress_idx_email	2026-03-21 21:13:08.204353+05:30
23	account	0008_emailaddress_unique_primary_email_fixup	2026-03-21 21:13:08.226872+05:30
24	account	0009_emailaddress_unique_primary_email	2026-03-21 21:13:08.241368+05:30
25	admin	0001_initial	2026-03-21 21:13:08.279015+05:30
26	admin	0002_logentry_remove_auto_add	2026-03-21 21:13:08.288985+05:30
27	admin	0003_logentry_add_action_flag_choices	2026-03-21 21:13:08.303798+05:30
28	stocks	0001_initial	2026-03-21 21:13:08.366335+05:30
29	mlops	0001_initial	2026-03-21 21:13:08.452195+05:30
30	portfolio	0001_initial	2026-03-21 21:13:08.535061+05:30
31	sessions	0001_initial	2026-03-21 21:13:08.563748+05:30
32	sites	0001_initial	2026-03-21 21:13:08.578955+05:30
33	sites	0002_alter_domain_unique	2026-03-21 21:13:08.593502+05:30
34	socialaccount	0001_initial	2026-03-21 21:13:08.823162+05:30
35	socialaccount	0002_token_max_lengths	2026-03-21 21:13:08.88156+05:30
36	socialaccount	0003_extra_data_default_dict	2026-03-21 21:13:08.912265+05:30
37	socialaccount	0004_app_provider_id_settings	2026-03-21 21:13:08.959203+05:30
38	socialaccount	0005_socialtoken_nullable_app	2026-03-21 21:13:09.004147+05:30
39	socialaccount	0006_alter_socialaccount_extra_data	2026-03-21 21:13:09.049213+05:30
40	token_blacklist	0001_initial	2026-03-21 21:13:09.177776+05:30
41	token_blacklist	0002_outstandingtoken_jti_hex	2026-03-21 21:13:09.200925+05:30
42	token_blacklist	0003_auto_20171017_2007	2026-03-21 21:13:09.232985+05:30
43	token_blacklist	0004_auto_20171017_2013	2026-03-21 21:13:09.270317+05:30
44	token_blacklist	0005_remove_outstandingtoken_jti	2026-03-21 21:13:09.292548+05:30
45	token_blacklist	0006_auto_20171017_2113	2026-03-21 21:13:09.316516+05:30
46	token_blacklist	0007_auto_20171017_2214	2026-03-21 21:13:09.380721+05:30
47	token_blacklist	0008_migrate_to_bigautofield	2026-03-21 21:13:09.488457+05:30
48	token_blacklist	0010_fix_migrate_to_bigautofield	2026-03-21 21:13:09.566326+05:30
49	token_blacklist	0011_linearizes_history	2026-03-21 21:13:09.571861+05:30
50	token_blacklist	0012_alter_outstandingtoken_user	2026-03-21 21:13:09.609714+05:30
51	trading	0001_initial	2026-03-21 21:13:09.699291+05:30
52	accounts	0002_user_google_sub_user_telegram_link_code_and_more	2026-03-23 15:48:43.270254+05:30
53	mlops	0002_stockcluster_portfolio	2026-03-23 15:48:43.567511+05:30
54	insights	0001_initial	2026-03-24 13:03:05.474179+05:30
55	otp	0001_initial	2026-03-25 22:41:10.833312+05:30
56	stocks	0002_alter_stockprice_options_and_more	2026-03-26 12:31:12.815958+05:30
57	stocks	0003_stockmaster_high_52week_stockmaster_low_52week_and_more	2026-03-26 12:31:34.759696+05:30
58	trading	0002_alter_transaction_portfolio_alter_transaction_user	2026-03-26 12:31:34.780609+05:30
59	portfolio	0002_portfolio_description	2026-03-28 13:04:02.244075+05:30
60	portfolio	0002_alter_portfolio_unique_together_and_more	2026-03-29 23:44:02.78199+05:30
61	portfolio	0003_add_missing_fields	2026-03-29 23:49:01.864472+05:30
62	portfolio	0003_create_holding_table	2026-03-30 00:37:13.382736+05:30
63	token_blacklist	0013_alter_blacklistedtoken_options_and_more	2026-03-30 00:43:35.582943+05:30
64	portfolio	0003_add_missing_portfolio_fields	2026-03-30 01:23:40.689521+05:30
65	portfolio	0004_merge_20260330_0122	2026-03-30 01:25:11.490186+05:30
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
\.


--
-- Data for Name: django_site; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.django_site (id, domain, name) FROM stdin;
1	example.com	example.com
\.


--
-- Data for Name: insights_marketstocksnapshot; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.insights_marketstocksnapshot (id, symbol, name, sector, market, market_price, day_change, day_change_pct, volume, market_cap, data_source, updated_at) FROM stdin;
844	AMBUJACEM.NS	AMBUJACEM	Unknown	IN	412.05	16.7	4.22	27660	0	yahoo	2026-03-24 14:42:24.454732+05:30
845	APOLLOHOSP.NS	APOLLOHOSP	Unknown	IN	7396	251	3.51	4567	0	yahoo	2026-03-24 14:42:24.454732+05:30
846	ASHOKLEY.NS	ASHOKLEY	Unknown	IN	166.83	4.85	2.99	96016	0	yahoo	2026-03-24 14:42:24.454732+05:30
847	ASIANPAINT.NS	ASIANPAINT	Unknown	IN	2213.7	92.4	4.36	14472	0	yahoo	2026-03-24 14:42:24.454732+05:30
848	ASTRAL.NS	ASTRAL	Unknown	IN	1602.4	46.1	2.96	910	0	yahoo	2026-03-24 14:42:24.454732+05:30
849	AUROPHARMA.NS	AUROPHARMA	Unknown	IN	1279.4	0.7	0.05	1517	0	yahoo	2026-03-24 14:42:24.454732+05:30
850	DMART.NS	DMART	Unknown	IN	3756	100.4	2.75	1548	0	yahoo	2026-03-24 14:42:24.454732+05:30
851	AXISBANK.NS	AXISBANK	Unknown	IN	1195.3	24.7	2.11	9658	0	yahoo	2026-03-24 14:42:24.454732+05:30
852	BSE.NS	BSE	Unknown	IN	2800.4	86	3.17	28134	0	yahoo	2026-03-24 14:42:24.454732+05:30
853	BAJAJ-AUTO.NS	BAJAJ-AUTO	Unknown	IN	8919	143	1.63	541	0	yahoo	2026-03-24 14:42:24.454732+05:30
854	BAJFINANCE.NS	BAJFINANCE	Unknown	IN	845.6	33	4.06	105809	0	yahoo	2026-03-24 14:42:24.454732+05:30
855	BAJAJFINSV.NS	BAJAJFINSV	Unknown	IN	1698	22.5	1.34	2819	0	yahoo	2026-03-24 14:42:24.454732+05:30
856	BAJAJHLDNG.NS	BAJAJHLDNG	Unknown	IN	9341	179	1.95	128	0	yahoo	2026-03-24 14:42:24.454732+05:30
857	BAJAJHFL.NS	BAJAJHFL	Unknown	IN	78.33	-0.18	-0.23	40407	0	yahoo	2026-03-24 14:42:24.454732+05:30
858	BANKBARODA.NS	BANKBARODA	Unknown	IN	270.95	5.05	1.9	50422	0	yahoo	2026-03-24 14:42:24.454732+05:30
859	BANKINDIA.NS	BANKINDIA	Unknown	IN	146.04	2.31	1.61	16786	0	yahoo	2026-03-24 14:42:24.454732+05:30
860	BDL.NS	BDL	Unknown	IN	1172.3	13.8	1.19	5828	0	yahoo	2026-03-24 14:42:24.454732+05:30
861	BEL.NS	BEL	Unknown	IN	413.6	8.1	2	120567	0	yahoo	2026-03-24 14:42:24.454732+05:30
862	BHARATFORG.NS	BHARATFORG	Unknown	IN	1711.5	62.9	3.82	4664	0	yahoo	2026-03-24 14:42:24.454732+05:30
863	BHEL.NS	BHEL	Unknown	IN	257.25	4.4	1.74	22663	0	yahoo	2026-03-24 14:42:24.454732+05:30
864	BPCL.NS	BPCL	Unknown	IN	280.25	8.95	3.3	173588	0	yahoo	2026-03-24 14:42:24.454732+05:30
865	BHARTIARTL.NS	BHARTIARTL	Unknown	IN	1800.1	4.2	0.23	79193	0	yahoo	2026-03-24 14:42:24.454732+05:30
866	BHARTIHEXA.NS	BHARTIHEXA	Unknown	IN	1575	-0.7	-0.04	437	0	yahoo	2026-03-24 14:42:24.454732+05:30
867	BIOCON.NS	BIOCON	Unknown	IN	368.25	1.1	0.3	1895	0	yahoo	2026-03-24 14:42:24.454732+05:30
868	BLUESTARCO.NS	BLUESTARCO	Unknown	IN	1673.6	52.5	3.24	1010	0	yahoo	2026-03-24 14:42:24.454732+05:30
869	BOSCHLTD.NS	BOSCHLTD	Unknown	IN	30110	975	3.35	68	0	yahoo	2026-03-24 14:42:24.454732+05:30
870	BRITANNIA.NS	BRITANNIA	Unknown	IN	5536	46	0.84	266	0	yahoo	2026-03-24 14:42:24.454732+05:30
871	CGPOWER.NS	CGPOWER	Unknown	IN	666.35	2.25	0.34	11560	0	yahoo	2026-03-24 14:42:24.454732+05:30
872	CANBK.NS	CANBK	Unknown	IN	132.89	3.33	2.57	145313	0	yahoo	2026-03-24 14:42:24.454732+05:30
873	CHOLAFIN.NS	CHOLAFIN	Unknown	IN	1413.9	33	2.39	4119	0	yahoo	2026-03-24 14:42:24.454732+05:30
874	CIPLA.NS	CIPLA	Unknown	IN	1219.2	-2.6	-0.21	3538	0	yahoo	2026-03-24 14:42:24.454732+05:30
875	COALINDIA.NS	COALINDIA	Unknown	IN	442.45	-12.8	-2.81	37778	0	yahoo	2026-03-24 14:42:24.454732+05:30
876	COCHINSHIP.NS	COCHINSHIP	Unknown	IN	1303.7	34.5	2.72	7266	0	yahoo	2026-03-24 14:42:24.454732+05:30
877	COFORGE.NS	COFORGE	Unknown	IN	1113.6	13.2	1.2	7414	0	yahoo	2026-03-24 14:42:24.454732+05:30
878	COLPAL.NS	COLPAL	Unknown	IN	1878.7	29.5	1.6	1432	0	yahoo	2026-03-24 14:42:24.454732+05:30
879	CONCOR.NS	CONCOR	Unknown	IN	432.25	8.5	2.01	14890	0	yahoo	2026-03-24 14:42:24.465999+05:30
880	COROMANDEL.NS	COROMANDEL	Unknown	IN	1940.9	94.4	5.11	199	0	yahoo	2026-03-24 14:42:24.465999+05:30
881	CUMMINSIND.NS	CUMMINSIND	Unknown	IN	4612.1	94.1	2.08	6702	0	yahoo	2026-03-24 14:42:24.465999+05:30
913	HYUNDAI.NS	HYUNDAI	Unknown	IN	1858.3	-9.2	-0.49	2309	0	yahoo	2026-03-24 14:42:24.465999+05:30
914	ICICIBANK.NS	ICICIBANK	Unknown	IN	1246.4	23.7	1.94	165281	0	yahoo	2026-03-24 14:42:24.465999+05:30
915	ICICIGI.NS	ICICIGI	Unknown	IN	1734.8	12.6	0.73	135	0	yahoo	2026-03-24 14:42:24.465999+05:30
916	IDFCFIRSTB.NS	IDFCFIRSTB	Unknown	IN	62.1	1.86	3.09	133909	0	yahoo	2026-03-24 14:42:24.465999+05:30
917	IRB.NS	IRB	Unknown	IN	40.79	0.55	1.37	27619	0	yahoo	2026-03-24 14:42:24.465999+05:30
918	ITCHOTELS.NS	ITCHOTELS	Unknown	IN	146	5.89	4.2	50311	0	yahoo	2026-03-24 14:42:24.465999+05:30
919	ITC.NS	ITC	Unknown	IN	291.15	0.7	0.24	102093	0	yahoo	2026-03-24 14:42:24.465999+05:30
920	INDIANB.NS	INDIANB	Unknown	IN	868	29.8	3.56	11239	0	yahoo	2026-03-24 14:42:24.465999+05:30
921	INDHOTEL.NS	INDHOTEL	Unknown	IN	602.8	20.35	3.49	23206	0	yahoo	2026-03-24 14:42:24.465999+05:30
922	IOC.NS	IOC	Unknown	IN	138.29	0.18	0.13	317671	0	yahoo	2026-03-24 14:42:24.465999+05:30
923	IRCTC.NS	IRCTC	Unknown	IN	514.9	4.6	0.9	9721	0	yahoo	2026-03-24 14:42:24.465999+05:30
924	IRFC.NS	IRFC	Unknown	IN	93.04	3.59	4.01	151731	0	yahoo	2026-03-24 14:42:24.465999+05:30
925	IREDA.NS	IREDA	Unknown	IN	114.5	3.99	3.61	36996	0	yahoo	2026-03-24 14:42:24.465999+05:30
926	IGL.NS	IGL	Unknown	IN	149.62	1.64	1.11	6267	0	yahoo	2026-03-24 14:42:24.465999+05:30
927	INDUSTOWER.NS	INDUSTOWER	Unknown	IN	428.15	14.55	3.52	2231	0	yahoo	2026-03-24 14:42:24.465999+05:30
928	INDUSINDBK.NS	INDUSINDBK	Unknown	IN	797.15	18.8	2.42	4514	0	yahoo	2026-03-24 14:42:24.465999+05:30
929	NAUKRI.NS	NAUKRI	Unknown	IN	991.6	16.9	1.73	1625	0	yahoo	2026-03-24 14:42:24.465999+05:30
930	INFY.NS	INFY	Unknown	IN	1285.8	29	2.31	44834	0	yahoo	2026-03-24 14:42:24.465999+05:30
931	INDIGO.NS	INDIGO	Unknown	IN	4139.5	194.2	4.92	13054	0	yahoo	2026-03-24 14:42:24.465999+05:30
932	JSWENERGY.NS	JSWENERGY	Unknown	IN	484.65	1.95	0.4	6981	0	yahoo	2026-03-24 14:42:24.465999+05:30
933	JSWSTEEL.NS	JSWSTEEL	Unknown	IN	1131.3	21.7	1.96	3914	0	yahoo	2026-03-24 14:42:24.465999+05:30
934	JINDALSTEL.NS	JINDALSTEL	Unknown	IN	1120.5	14.3	1.29	2465	0	yahoo	2026-03-24 14:42:24.465999+05:30
935	JIOFIN.NS	JIOFIN	Unknown	IN	232.1	6	2.65	177971	0	yahoo	2026-03-24 14:42:24.465999+05:30
936	JUBLFOOD.NS	JUBLFOOD	Unknown	IN	447.95	9.9	2.26	1933	0	yahoo	2026-03-24 14:42:24.465999+05:30
937	KEI.NS	KEI	Unknown	IN	4106	115.5	2.89	2262	0	yahoo	2026-03-24 14:42:24.465999+05:30
938	KPITTECH.NS	KPITTECH	Unknown	IN	664.8	5.5	0.83	7786	0	yahoo	2026-03-24 14:42:24.465999+05:30
939	KALYANKJIL.NS	KALYANKJIL	Unknown	IN	371.05	8.35	2.3	16833	0	yahoo	2026-03-24 14:42:24.465999+05:30
940	KOTAKBANK.NS	KOTAKBANK	Unknown	IN	367.75	11.2	3.14	203136	0	yahoo	2026-03-24 14:42:24.465999+05:30
941	LTF.NS	LTF	Unknown	IN	254.1	6.45	2.6	13296	0	yahoo	2026-03-24 14:42:24.465999+05:30
942	LICHSGFIN.NS	LICHSGFIN	Unknown	IN	477.15	16.45	3.57	8852	0	yahoo	2026-03-24 14:42:24.465999+05:30
943	LTM.NS	LTM	Unknown	IN	4212.9	107.3	2.61	2281	0	yahoo	2026-03-24 14:42:24.465999+05:30
944	LT.NS	LT	Unknown	IN	3514	171.6	5.13	44498	0	yahoo	2026-03-24 14:42:24.465999+05:30
945	LICI.NS	LICI	Unknown	IN	759.05	19.05	2.57	3642	0	yahoo	2026-03-24 14:42:24.465999+05:30
946	LODHA.NS	LODHA	Unknown	IN	725.1	-2.8	-0.38	19693	0	yahoo	2026-03-24 14:42:24.465999+05:30
947	LUPIN.NS	LUPIN	Unknown	IN	2326	29.3	1.28	1050	0	yahoo	2026-03-24 14:42:24.465999+05:30
948	MRF.NS	MRF	Unknown	IN	128355	3380	2.7	59	0	yahoo	2026-03-24 14:42:24.465999+05:30
949	M&MFIN.NS	M&MFIN	Unknown	IN	304.4	11.35	3.87	1433	0	yahoo	2026-03-24 14:42:24.465999+05:30
950	M&M.NS	M&M	Unknown	IN	3033	77.2	2.61	21882	0	yahoo	2026-03-24 14:42:24.465999+05:30
951	MANKIND.NS	MANKIND	Unknown	IN	1977.9	50.5	2.62	306	0	yahoo	2026-03-24 14:42:24.465999+05:30
952	MARICO.NS	MARICO	Unknown	IN	740.05	14.75	2.03	2187	0	yahoo	2026-03-24 14:42:24.465999+05:30
953	MARUTI.NS	MARUTI	Unknown	IN	12494	139	1.13	2914	0	yahoo	2026-03-24 14:42:24.465999+05:30
954	MFSL.NS	MFSL	Unknown	IN	1582.6	15.1	0.96	236	0	yahoo	2026-03-24 14:42:24.465999+05:30
955	MAXHEALTH.NS	MAXHEALTH	Unknown	IN	973.4	16.5	1.72	4236	0	yahoo	2026-03-24 14:42:24.465999+05:30
956	MAZDOCK.NS	MAZDOCK	Unknown	IN	2253.3	46.6	2.11	7394	0	yahoo	2026-03-24 14:42:24.467399+05:30
957	MOTILALOFS.NS	MOTILALOFS	Unknown	IN	651.1	22.9	3.65	1810	0	yahoo	2026-03-24 14:42:24.467399+05:30
958	MPHASIS.NS	MPHASIS	Unknown	IN	2124.6	61	2.96	74	0	yahoo	2026-03-24 14:42:24.467399+05:30
959	MUTHOOTFIN.NS	MUTHOOTFIN	Unknown	IN	3122.7	7.1	0.23	1814	0	yahoo	2026-03-24 14:42:24.467399+05:30
960	NHPC.NS	NHPC	Unknown	IN	76.49	1.21	1.61	52134	0	yahoo	2026-03-24 14:42:24.467399+05:30
961	NMDC.NS	NMDC	Unknown	IN	76.9	1.81	2.41	163222	0	yahoo	2026-03-24 14:42:24.467399+05:30
962	NTPCGREEN.NS	NTPCGREEN	Unknown	IN	96.4	-0.48	-0.5	42850	0	yahoo	2026-03-24 14:42:24.467399+05:30
963	NTPC.NS	NTPC	Unknown	IN	374.9	2.5	0.67	19261	0	yahoo	2026-03-24 14:42:24.467399+05:30
964	NATIONALUM.NS	NATIONALUM	Unknown	IN	356.2	6.45	1.84	48815	0	yahoo	2026-03-24 14:42:24.467399+05:30
965	NESTLEIND.NS	NESTLEIND	Unknown	IN	1185.5	18.7	1.6	1419	0	yahoo	2026-03-24 14:42:24.467399+05:30
966	OBEROIRLTY.NS	OBEROIRLTY	Unknown	IN	1439.8	28.3	2	1897	0	yahoo	2026-03-24 14:42:24.467399+05:30
967	ONGC.NS	ONGC	Unknown	IN	268.3	2.85	1.07	123330	0	yahoo	2026-03-24 14:42:24.467399+05:30
968	OIL.NS	OIL	Unknown	IN	480.5	15.85	3.41	15840	0	yahoo	2026-03-24 14:42:24.467399+05:30
969	PAYTM.NS	PAYTM	Unknown	IN	1034.7	41.9	4.22	12328	0	yahoo	2026-03-24 14:42:24.467399+05:30
970	OFSS.NS	OFSS	Unknown	IN	6627	182	2.82	591	0	yahoo	2026-03-24 14:42:24.467399+05:30
971	POLICYBZR.NS	POLICYBZR	Unknown	IN	1465.8	31.4	2.19	1480	0	yahoo	2026-03-24 14:42:24.467399+05:30
972	PIIND.NS	PIIND	Unknown	IN	2769	6.4	0.23	1962	0	yahoo	2026-03-24 14:42:24.467399+05:30
973	PAGEIND.NS	PAGEIND	Unknown	IN	32210	865	2.76	38	0	yahoo	2026-03-24 14:42:24.467399+05:30
974	PATANJALI.NS	PATANJALI	Unknown	IN	471.85	8.55	1.85	5040	0	yahoo	2026-03-24 14:42:24.467399+05:30
975	PERSISTENT.NS	PERSISTENT	Unknown	IN	4894.4	169.9	3.6	1693	0	yahoo	2026-03-24 14:42:24.467399+05:30
976	PHOENIXLTD.NS	PHOENIXLTD	Unknown	IN	1509.8	32.4	2.19	104	0	yahoo	2026-03-24 14:42:24.467399+05:30
977	PIDILITIND.NS	PIDILITIND	Unknown	IN	1337.5	22.6	1.72	2013	0	yahoo	2026-03-24 14:42:24.467399+05:30
978	POLYCAB.NS	POLYCAB	Unknown	IN	7092.5	297.5	4.38	3860	0	yahoo	2026-03-24 14:42:24.467399+05:30
979	PFC.NS	PFC	Unknown	IN	399.35	1.35	0.34	33937	0	yahoo	2026-03-24 14:42:24.467399+05:30
980	POWERGRID.NS	POWERGRID	Unknown	IN	298.95	-3.15	-1.04	201707	0	yahoo	2026-03-24 14:42:24.467399+05:30
981	PREMIERENE.NS	PREMIERENE	Unknown	IN	888.5	21.95	2.53	9279	0	yahoo	2026-03-24 14:42:24.467399+05:30
982	PRESTIGE.NS	PRESTIGE	Unknown	IN	1198.6	20	1.7	256	0	yahoo	2026-03-24 14:42:24.467399+05:30
983	PNB.NS	PNB	Unknown	IN	107.1	1.55	1.47	190285	0	yahoo	2026-03-24 14:42:24.467399+05:30
984	RECLTD.NS	RECLTD	Unknown	IN	320.1	3.65	1.15	38556	0	yahoo	2026-03-24 14:42:24.467399+05:30
985	RVNL.NS	RVNL	Unknown	IN	258.35	8.1	3.24	33841	0	yahoo	2026-03-24 14:42:24.467399+05:30
986	RELIANCE.NS	RELIANCE	Unknown	IN	1408.9	1.1	0.08	230040	0	yahoo	2026-03-24 14:42:24.467399+05:30
987	SBICARD.NS	SBICARD	Unknown	IN	676.6	23.3	3.57	1890	0	yahoo	2026-03-24 14:42:24.467399+05:30
988	SBILIFE.NS	SBILIFE	Unknown	IN	1839.4	7.1	0.39	1852	0	yahoo	2026-03-24 14:42:24.467399+05:30
989	SRF.NS	SRF	Unknown	IN	2471.4	79.9	3.34	1381	0	yahoo	2026-03-24 14:42:24.467399+05:30
990	MOTHERSON.NS	MOTHERSON	Unknown	IN	110.13	3.54	3.32	38179	0	yahoo	2026-03-24 14:42:24.467399+05:30
991	SHREECEM.NS	SHREECEM	Unknown	IN	23315	590	2.6	73	0	yahoo	2026-03-24 14:42:24.467399+05:30
992	SHRIRAMFIN.NS	SHRIRAMFIN	Unknown	IN	902.2	24.5	2.79	63317	0	yahoo	2026-03-24 14:42:24.467399+05:30
993	ENRIN.NS	ENRIN	Unknown	IN	2702.2	6.1	0.23	667	0	yahoo	2026-03-24 14:42:24.467399+05:30
994	SIEMENS.NS	SIEMENS	Unknown	IN	3024.8	36.5	1.22	522	0	yahoo	2026-03-24 14:42:24.467399+05:30
995	SOLARINDS.NS	SOLARINDS	Unknown	IN	12556	126	1.01	642	0	yahoo	2026-03-24 14:42:24.467399+05:30
996	SONACOMS.NS	SONACOMS	Unknown	IN	497.95	13	2.68	1331	0	yahoo	2026-03-24 14:42:24.467399+05:30
997	SBIN.NS	SBIN	Unknown	IN	1025.7	-6.2	-0.6	124285	0	yahoo	2026-03-24 14:42:24.467399+05:30
998	SAIL.NS	SAIL	Unknown	IN	145.9	2.86	2	94065	0	yahoo	2026-03-24 14:42:24.467399+05:30
999	SUNPHARMA.NS	SUNPHARMA	Unknown	IN	1751.2	-7.2	-0.41	6691	0	yahoo	2026-03-24 14:42:24.467399+05:30
1000	SUPREMEIND.NS	SUPREMEIND	Unknown	IN	3743.4	38.9	1.05	119	0	yahoo	2026-03-24 14:42:24.467399+05:30
1001	SUZLON.NS	SUZLON	Unknown	IN	40.89	0.95	2.38	476792	0	yahoo	2026-03-24 14:42:24.467399+05:30
1002	SWIGGY.NS	SWIGGY	Unknown	IN	278.85	6.3	2.31	29798	0	yahoo	2026-03-24 14:42:24.467399+05:30
1003	TVSMOTOR.NS	TVSMOTOR	Unknown	IN	3485.8	73.3	2.15	4568	0	yahoo	2026-03-24 14:42:24.467399+05:30
831	360ONE.NS	360ONE	Unknown	IN	986	0.6	0.06	1066	0	yahoo	2026-03-24 14:42:24.454732+05:30
832	ABB.NS	ABB	Unknown	IN	6182.5	141	2.33	1232	0	yahoo	2026-03-24 14:42:24.454732+05:30
833	ACC.NS	ACC	Unknown	IN	1339	9.2	0.69	757	0	yahoo	2026-03-24 14:42:24.454732+05:30
834	APLAPOLLO.NS	APLAPOLLO	Unknown	IN	1975.7	81.8	4.32	1078	0	yahoo	2026-03-24 14:42:24.454732+05:30
835	AUBANK.NS	AUBANK	Unknown	IN	877.7	28.15	3.31	1494	0	yahoo	2026-03-24 14:42:24.454732+05:30
836	ADANIENSOL.NS	ADANIENSOL	Unknown	IN	964.4	17.5	1.85	2529	0	yahoo	2026-03-24 14:42:24.454732+05:30
837	ADANIENT.NS	ADANIENT	Unknown	IN	1820	-13	-0.71	9352	0	yahoo	2026-03-24 14:42:24.454732+05:30
838	ADANIGREEN.NS	ADANIGREEN	Unknown	IN	837	20.55	2.52	9580	0	yahoo	2026-03-24 14:42:24.454732+05:30
839	ADANIPORTS.NS	ADANIPORTS	Unknown	IN	1342	38.4	2.95	19145	0	yahoo	2026-03-24 14:42:24.454732+05:30
840	ADANIPOWER.NS	ADANIPOWER	Unknown	IN	150.64	2.79	1.89	97852	0	yahoo	2026-03-24 14:42:24.454732+05:30
841	ATGL.NS	ATGL	Unknown	IN	518.35	4.75	0.92	25601	0	yahoo	2026-03-24 14:42:24.454732+05:30
842	ABCAPITAL.NS	ABCAPITAL	Unknown	IN	301.2	6.25	2.12	3306	0	yahoo	2026-03-24 14:42:24.454732+05:30
843	ALKEM.NS	ALKEM	Unknown	IN	5276.5	132	2.57	56	0	yahoo	2026-03-24 14:42:24.454732+05:30
882	DLF.NS	DLF	Unknown	IN	521.5	6.75	1.31	10118	0	yahoo	2026-03-24 14:42:24.465999+05:30
883	DABUR.NS	DABUR	Unknown	IN	421.7	4.35	1.04	8687	0	yahoo	2026-03-24 14:42:24.465999+05:30
884	DIVISLAB.NS	DIVISLAB	Unknown	IN	6016	2.5	0.04	139	0	yahoo	2026-03-24 14:42:24.465999+05:30
885	DIXON.NS	DIXON	Unknown	IN	10172	278	2.81	3416	0	yahoo	2026-03-24 14:42:24.465999+05:30
886	DRREDDY.NS	DRREDDY	Unknown	IN	1252.9	-0.4	-0.03	2058	0	yahoo	2026-03-24 14:42:24.465999+05:30
887	EICHERMOT.NS	EICHERMOT	Unknown	IN	6883	201.5	3.02	3436	0	yahoo	2026-03-24 14:42:24.465999+05:30
888	ETERNAL.NS	ETERNAL	Unknown	IN	237.61	10.65	4.69	302473	0	yahoo	2026-03-24 14:42:24.465999+05:30
889	EXIDEIND.NS	EXIDEIND	Unknown	IN	298.6	7.85	2.7	8376	0	yahoo	2026-03-24 14:42:24.465999+05:30
890	NYKAA.NS	NYKAA	Unknown	IN	241.3	6.55	2.79	3237	0	yahoo	2026-03-24 14:42:24.465999+05:30
891	FEDERALBNK.NS	FEDERALBNK	Unknown	IN	262.15	7.8	3.07	58161	0	yahoo	2026-03-24 14:42:24.465999+05:30
892	FORTIS.NS	FORTIS	Unknown	IN	810.45	11.25	1.41	2025	0	yahoo	2026-03-24 14:42:24.465999+05:30
893	GAIL.NS	GAIL	Unknown	IN	137.36	1.96	1.45	103838	0	yahoo	2026-03-24 14:42:24.465999+05:30
894	GMRAIRPORT.NS	GMRAIRPORT	Unknown	IN	89.01	4.24	5	84479	0	yahoo	2026-03-24 14:42:24.465999+05:30
895	GLENMARK.NS	GLENMARK	Unknown	IN	2081.5	-7.5	-0.36	1262	0	yahoo	2026-03-24 14:42:24.465999+05:30
896	GODFRYPHLP.NS	GODFRYPHLP	Unknown	IN	1890	46	2.49	1555	0	yahoo	2026-03-24 14:42:24.465999+05:30
897	GODREJCP.NS	GODREJCP	Unknown	IN	1012.1	9.7	0.97	534	0	yahoo	2026-03-24 14:42:24.465999+05:30
898	GODREJPROP.NS	GODREJPROP	Unknown	IN	1538.6	41.4	2.77	2479	0	yahoo	2026-03-24 14:42:24.465999+05:30
899	GRASIM.NS	GRASIM	Unknown	IN	2569.5	38.4	1.52	466	0	yahoo	2026-03-24 14:42:24.465999+05:30
900	HCLTECH.NS	HCLTECH	Unknown	IN	1373.2	14.6	1.07	16853	0	yahoo	2026-03-24 14:42:24.465999+05:30
901	HDFCAMC.NS	HDFCAMC	Unknown	IN	2356.5	101.9	4.52	3221	0	yahoo	2026-03-24 14:42:24.465999+05:30
902	HDFCBANK.NS	HDFCBANK	Unknown	IN	767.3	23.15	3.11	722050	0	yahoo	2026-03-24 14:42:24.465999+05:30
903	HDFCLIFE.NS	HDFCLIFE	Unknown	IN	602.6	10.5	1.77	9593	0	yahoo	2026-03-24 14:42:24.465999+05:30
904	HAVELLS.NS	HAVELLS	Unknown	IN	1241.1	10.1	0.82	1685	0	yahoo	2026-03-24 14:42:24.465999+05:30
905	HEROMOTOCO.NS	HEROMOTOCO	Unknown	IN	5281	216	4.26	3992	0	yahoo	2026-03-24 14:42:24.465999+05:30
906	HINDALCO.NS	HINDALCO	Unknown	IN	857.25	17	2.02	28851	0	yahoo	2026-03-24 14:42:24.465999+05:30
907	HAL.NS	HAL	Unknown	IN	3662	27.4	0.75	9892	0	yahoo	2026-03-24 14:42:24.465999+05:30
908	HINDPETRO.NS	HINDPETRO	Unknown	IN	335.7	16.55	5.19	94770	0	yahoo	2026-03-24 14:42:24.465999+05:30
909	HINDUNILVR.NS	HINDUNILVR	Unknown	IN	2089.2	37	1.8	2981	0	yahoo	2026-03-24 14:42:24.465999+05:30
910	HINDZINC.NS	HINDZINC	Unknown	IN	494.15	6.5	1.33	31758	0	yahoo	2026-03-24 14:42:24.465999+05:30
911	POWERINDIA.NS	POWERINDIA	Unknown	IN	25035	780	3.22	1039	0	yahoo	2026-03-24 14:42:24.465999+05:30
912	HUDCO.NS	HUDCO	Unknown	IN	168.6	3.49	2.11	7669	0	yahoo	2026-03-24 14:42:24.465999+05:30
1004	TATACOMM.NS	TATACOMM	Unknown	IN	1413.7	30.7	2.22	158	0	yahoo	2026-03-24 14:42:24.467399+05:30
1005	TCS.NS	TCS	Unknown	IN	2399.1	15.3	0.64	17499	0	yahoo	2026-03-24 14:42:24.467399+05:30
1006	TATACONSUM.NS	TATACONSUM	Unknown	IN	1046.8	23.2	2.27	2687	0	yahoo	2026-03-24 14:42:24.467399+05:30
1007	TATAELXSI.NS	TATAELXSI	Unknown	IN	4164.8	34.2	0.83	772	0	yahoo	2026-03-24 14:42:24.467399+05:30
1008	TMPV.NS	TMPV	Unknown	IN	310.35	5.1	1.67	89239	0	yahoo	2026-03-24 14:42:24.467399+05:30
1009	TATAPOWER.NS	TATAPOWER	Unknown	IN	385.35	-1.6	-0.41	45197	0	yahoo	2026-03-24 14:42:24.467399+05:30
1010	TATASTEEL.NS	TATASTEEL	Unknown	IN	190.49	3.32	1.77	153460	0	yahoo	2026-03-24 14:42:24.467399+05:30
1011	TATATECH.NS	TATATECH	Unknown	IN	532.45	13.45	2.59	3181	0	yahoo	2026-03-24 14:42:24.467399+05:30
1012	TECHM.NS	TECHM	Unknown	IN	1427.5	43.5	3.14	2581	0	yahoo	2026-03-24 14:42:24.467399+05:30
1013	TITAN.NS	TITAN	Unknown	IN	3878.7	25.6	0.66	5141	0	yahoo	2026-03-24 14:42:24.467399+05:30
1014	TORNTPHARM.NS	TORNTPHARM	Unknown	IN	4257.5	43.6	1.03	1386	0	yahoo	2026-03-24 14:42:24.467399+05:30
1015	TORNTPOWER.NS	TORNTPOWER	Unknown	IN	1361.6	-1.2	-0.09	796	0	yahoo	2026-03-24 14:42:24.467399+05:30
1016	TRENT.NS	TRENT	Unknown	IN	3372.5	15.8	0.47	3425	0	yahoo	2026-03-24 14:42:24.467399+05:30
1017	TIINDIA.NS	TIINDIA	Unknown	IN	2575.6	104.6	4.23	432	0	yahoo	2026-03-24 14:42:24.467399+05:30
1018	UPL.NS	UPL	Unknown	IN	621.25	18.85	3.13	1348	0	yahoo	2026-03-24 14:42:24.467399+05:30
1019	ULTRACEMCO.NS	ULTRACEMCO	Unknown	IN	10792	430	4.15	655	0	yahoo	2026-03-24 14:42:24.467399+05:30
1020	UNIONBANK.NS	UNIONBANK	Unknown	IN	173.75	5.17	3.07	55422	0	yahoo	2026-03-24 14:42:24.467399+05:30
1021	UNITDSPR.NS	UNITDSPR	Unknown	IN	1323	47.8	3.75	584	0	yahoo	2026-03-24 14:42:24.467399+05:30
1022	VBL.NS	VBL	Unknown	IN	390	7.8	2.04	18969	0	yahoo	2026-03-24 14:42:24.467399+05:30
1023	VEDL.NS	VEDL	Unknown	IN	650.25	4.5	0.7	113556	0	yahoo	2026-03-24 14:42:24.467399+05:30
1024	VMM.NS	VMM	Unknown	IN	106.5	6.82	6.84	38572	0	yahoo	2026-03-24 14:42:24.467399+05:30
1025	IDEA.NS	IDEA	Unknown	IN	8.88	0.18	2.07	3658841	0	yahoo	2026-03-24 14:42:24.467399+05:30
1026	VOLTAS.NS	VOLTAS	Unknown	IN	1303.6	52.4	4.19	865	0	yahoo	2026-03-24 14:42:24.467399+05:30
1027	WAAREEENER.NS	WAAREEENER	Unknown	IN	3095.6	31	1.01	7268	0	yahoo	2026-03-24 14:42:24.467399+05:30
1028	WIPRO.NS	WIPRO	Unknown	IN	189.05	1.51	0.81	51339	0	yahoo	2026-03-24 14:42:24.467399+05:30
1029	YESBANK.NS	YESBANK	Unknown	IN	18.04	0.39	2.21	452859	0	yahoo	2026-03-24 14:42:24.467399+05:30
1030	ZYDUSLIFE.NS	ZYDUSLIFE	Unknown	IN	885.35	24.75	2.88	1365	0	yahoo	2026-03-24 14:42:24.467399+05:30
1031	NVDA	NVDA	Unknown	US	175.64	2.94	1.7	176073078	0	yahoo	2026-03-24 14:42:24.467399+05:30
1032	AAPL	AAPL	Unknown	US	251.49	3.5	1.41	37465587	0	yahoo	2026-03-24 14:42:24.467399+05:30
1033	MSFT	MSFT	Unknown	US	383	1.13	0.3	28357488	0	yahoo	2026-03-24 14:42:24.467399+05:30
1034	AMZN	AMZN	Unknown	US	210.14	4.77	2.32	43926097	0	yahoo	2026-03-24 14:42:24.467399+05:30
1035	GOOGL	GOOGL	Unknown	US	302.06	1.06	0.35	27375734	0	yahoo	2026-03-24 14:42:24.467399+05:30
1036	GOOG	GOOG	Unknown	US	299.02	0.23	0.08	22068828	0	yahoo	2026-03-24 14:42:24.467399+05:30
1037	META	META	Unknown	US	604.06	10.4	1.75	13258580	0	yahoo	2026-03-24 14:42:24.467399+05:30
1038	AVGO	AVGO	Unknown	US	322.51	12	3.86	27165250	0	yahoo	2026-03-24 14:42:24.467399+05:30
1039	TSLA	TSLA	Unknown	US	380.85	12.89	3.5	72583482	0	yahoo	2026-03-24 14:42:24.467399+05:30
1040	BRK.B	BRK.B	Unknown	US	479.98	-0.96	-0.2	4932245	0	yahoo	2026-03-24 14:42:24.467399+05:30
1041	WMT	WMT	Unknown	US	120.72	1.7	1.43	22106694	0	yahoo	2026-03-24 14:42:24.467399+05:30
1042	LLY	LLY	Unknown	US	910.55	3.85	0.42	2127912	0	yahoo	2026-03-24 14:42:24.467399+05:30
1043	JPM	JPM	Unknown	US	289.91	3.35	1.17	7193450	0	yahoo	2026-03-24 14:42:24.467399+05:30
1044	XOM	XOM	Unknown	US	161.13	1.46	0.91	24984729	0	yahoo	2026-03-24 14:42:24.467399+05:30
1045	V	V	Unknown	US	304.44	2.82	0.93	5655008	0	yahoo	2026-03-24 14:42:24.467399+05:30
1046	JNJ	JNJ	Unknown	US	235.42	0.05	0.02	7301338	0	yahoo	2026-03-24 14:42:24.467399+05:30
1047	MU	MU	Unknown	US	404.35	-18.55	-4.39	53942517	0	yahoo	2026-03-24 14:42:24.467399+05:30
1048	MA	MA	Unknown	US	500.38	4.06	0.82	2258307	0	yahoo	2026-03-24 14:42:24.467399+05:30
1049	COST	COST	Unknown	US	965.73	-6.6	-0.68	1774706	0	yahoo	2026-03-24 14:42:24.467399+05:30
1050	ORCL	ORCL	Unknown	US	154.34	4.66	3.11	19775140	0	yahoo	2026-03-24 14:42:24.467399+05:30
1051	CVX	CVX	Unknown	US	205.21	3.48	1.73	15614190	0	yahoo	2026-03-24 14:42:24.467399+05:30
1052	NFLX	NFLX	Unknown	US	93.38	1.56	1.7	33605523	0	yahoo	2026-03-24 14:42:24.467399+05:30
1053	ABBV	ABBV	Unknown	US	204.93	-0.14	-0.07	7340882	0	yahoo	2026-03-24 14:42:24.467399+05:30
1054	PLTR	PLTR	Unknown	US	160.84	10.16	6.74	55951149	0	yahoo	2026-03-24 14:42:24.467399+05:30
1055	BAC	BAC	Unknown	US	47.52	0.36	0.76	42120034	0	yahoo	2026-03-24 14:42:24.467399+05:30
1056	PG	PG	Unknown	US	143.99	-0.29	-0.2	7323384	0	yahoo	2026-03-24 14:42:24.46935+05:30
1057	AMD	AMD	Unknown	US	202.68	1.35	0.67	30613534	0	yahoo	2026-03-24 14:42:24.46935+05:30
1058	KO	KO	Unknown	US	75.11	0.36	0.48	15049029	0	yahoo	2026-03-24 14:42:24.46935+05:30
1059	HD	HD	Unknown	US	330.9	10.15	3.16	4474857	0	yahoo	2026-03-24 14:42:24.46935+05:30
1060	CAT	CAT	Unknown	US	701.7	20.82	3.06	2980122	0	yahoo	2026-03-24 14:42:24.46935+05:30
1061	CSCO	CSCO	Unknown	US	78.82	1.17	1.51	16457441	0	yahoo	2026-03-24 14:42:24.46935+05:30
1062	GE	GE	Unknown	US	291.54	4.75	1.66	5477330	0	yahoo	2026-03-24 14:42:24.46935+05:30
1063	LRCX	LRCX	Unknown	US	233.31	4.95	2.17	9497455	0	yahoo	2026-03-24 14:42:24.46935+05:30
1064	AMAT	AMAT	Unknown	US	361.79	4.73	1.32	5901061	0	yahoo	2026-03-24 14:42:24.46935+05:30
1065	MRK	MRK	Unknown	US	115.68	1.5	1.31	6391503	0	yahoo	2026-03-24 14:42:24.46935+05:30
1066	RTX	RTX	Unknown	US	194.82	-3.34	-1.69	4898550	0	yahoo	2026-03-24 14:42:24.46935+05:30
1067	MS	MS	Unknown	US	164.32	2.85	1.77	8010720	0	yahoo	2026-03-24 14:42:24.46935+05:30
1068	PM	PM	Unknown	US	163.24	0.13	0.08	2689930	0	yahoo	2026-03-24 14:42:24.46935+05:30
1069	UNH	UNH	Unknown	US	269.54	-6.05	-2.2	10322473	0	yahoo	2026-03-24 14:42:24.46935+05:30
1070	GS	GS	Unknown	US	831.27	17.74	2.18	2183060	0	yahoo	2026-03-24 14:42:24.46935+05:30
1071	WFC	WFC	Unknown	US	78.28	0.68	0.88	12562719	0	yahoo	2026-03-24 14:42:24.46935+05:30
1072	TMUS	TMUS	Unknown	US	208.76	0.29	0.14	5157851	0	yahoo	2026-03-24 14:42:24.46935+05:30
1073	GEV	GEV	Unknown	US	882.64	31.57	3.71	3041969	0	yahoo	2026-03-24 14:42:24.46935+05:30
1074	IBM	IBM	Unknown	US	248.44	6.67	2.76	4940290	0	yahoo	2026-03-24 14:42:24.46935+05:30
1075	LIN	LIN	Unknown	US	478.05	-10.1	-2.07	2787849	0	yahoo	2026-03-24 14:42:24.46935+05:30
1076	MCD	MCD	Unknown	US	308.47	-0.38	-0.12	2077397	0	yahoo	2026-03-24 14:42:24.46935+05:30
1077	INTC	INTC	Unknown	US	44.01	0.14	0.32	78536137	0	yahoo	2026-03-24 14:42:24.46935+05:30
1078	VZ	VZ	Unknown	US	50.58	0.6	1.2	17384393	0	yahoo	2026-03-24 14:42:24.46935+05:30
1079	PEP	PEP	Unknown	US	150.88	0.84	0.56	5633422	0	yahoo	2026-03-24 14:42:24.46935+05:30
1080	AXP	AXP	Unknown	US	301.91	6.41	2.17	4291624	0	yahoo	2026-03-24 14:42:24.46935+05:30
1081	T	T	Unknown	US	28.76	0.45	1.59	45707966	0	yahoo	2026-03-24 14:42:24.46935+05:30
1082	KLAC	KLAC	Unknown	US	1511.43	12.76	0.85	1173736	0	yahoo	2026-03-24 14:42:24.46935+05:30
1083	C	C	Unknown	US	111.64	2.12	1.94	16878805	0	yahoo	2026-03-24 14:42:24.46935+05:30
1084	AMGN	AMGN	Unknown	US	349.77	1.97	0.57	2221380	0	yahoo	2026-03-24 14:42:24.46935+05:30
1085	NEE	NEE	Unknown	US	90.23	0.73	0.82	10281661	0	yahoo	2026-03-24 14:42:24.46935+05:30
1086	ABT	ABT	Unknown	US	104.85	-0.61	-0.58	5891472	0	yahoo	2026-03-24 14:42:24.46935+05:30
1087	CRM	CRM	Unknown	US	195.18	-0.2	-0.1	13906882	0	yahoo	2026-03-24 14:42:24.46935+05:30
1088	DIS	DIS	Unknown	US	97.95	-1.56	-1.57	9193737	0	yahoo	2026-03-24 14:42:24.46935+05:30
1089	TMO	TMO	Unknown	US	478.12	3.73	0.79	1444446	0	yahoo	2026-03-24 14:42:24.46935+05:30
1090	TJX	TJX	Unknown	US	156.5	1.52	0.98	3158632	0	yahoo	2026-03-24 14:42:24.46935+05:30
1091	TXN	TXN	Unknown	US	188.63	1.44	0.77	6298257	0	yahoo	2026-03-24 14:42:24.46935+05:30
1092	GILD	GILD	Unknown	US	137.34	0.13	0.09	7360842	0	yahoo	2026-03-24 14:42:24.46935+05:30
1093	ISRG	ISRG	Unknown	US	478.04	0.07	0.01	1500865	0	yahoo	2026-03-24 14:42:24.46935+05:30
1094	SCHW	SCHW	Unknown	US	95.3	0.64	0.68	6564287	0	yahoo	2026-03-24 14:42:24.470072+05:30
1095	ANET	ANET	Unknown	US	135.88	4.66	3.55	4626256	0	yahoo	2026-03-24 14:42:24.470072+05:30
1096	APH	APH	Unknown	US	130.67	3.93	3.1	7652632	0	yahoo	2026-03-24 14:42:24.470072+05:30
1097	COP	COP	Unknown	US	127.19	0.27	0.21	9440332	0	yahoo	2026-03-24 14:42:24.470072+05:30
1098	PFE	PFE	Unknown	US	26.77	-0.2	-0.74	29572260	0	yahoo	2026-03-24 14:42:24.470072+05:30
1099	BA	BA	Unknown	US	198.41	3.29	1.69	5577430	0	yahoo	2026-03-24 14:42:24.470072+05:30
1100	UBER	UBER	Unknown	US	75.12	1.23	1.66	11290539	0	yahoo	2026-03-24 14:42:24.470072+05:30
1101	DE	DE	Unknown	US	569.03	9.3	1.66	865155	0	yahoo	2026-03-24 14:42:24.470072+05:30
1102	ADI	ADI	Unknown	US	312.19	2.76	0.89	3157993	0	yahoo	2026-03-24 14:42:24.470072+05:30
1103	APP	APP	Unknown	US	458.95	16.56	3.74	4578659	0	yahoo	2026-03-24 14:42:24.470072+05:30
1104	BLK	BLK	Unknown	US	974.58	16.67	1.74	911004	0	yahoo	2026-03-24 14:42:24.470072+05:30
1105	LMT	LMT	Unknown	US	616.25	-11.18	-1.78	1337592	0	yahoo	2026-03-24 14:42:24.470072+05:30
1106	HON	HON	Unknown	US	223.01	1.51	0.68	3657209	0	yahoo	2026-03-24 14:42:24.470072+05:30
1107	UNP	UNP	Unknown	US	238.37	3.45	1.47	1840003	0	yahoo	2026-03-24 14:42:24.470072+05:30
1108	QCOM	QCOM	Unknown	US	128.35	-1.55	-1.19	10418711	0	yahoo	2026-03-24 14:42:24.470072+05:30
1109	ETN	ETN	Unknown	US	359.74	2.94	0.82	2208355	0	yahoo	2026-03-24 14:42:24.470072+05:30
1110	BKNG	BKNG	Unknown	US	4396.79	72.75	1.68	333761	0	yahoo	2026-03-24 14:42:24.470072+05:30
1111	WELL	WELL	Unknown	US	195	-0.94	-0.48	3505727	0	yahoo	2026-03-24 14:42:24.470072+05:30
1112	DHR	DHR	Unknown	US	190	0.65	0.34	2392160	0	yahoo	2026-03-24 14:42:24.470072+05:30
1113	PANW	PANW	Unknown	US	164.05	1.1	0.68	7215622	0	yahoo	2026-03-24 14:42:24.470072+05:30
1114	SYK	SYK	Unknown	US	332.59	-3.08	-0.92	1595256	0	yahoo	2026-03-24 14:42:24.470072+05:30
1115	SPGI	SPGI	Unknown	US	428.87	4.44	1.05	1171994	0	yahoo	2026-03-24 14:42:24.470072+05:30
1116	LOW	LOW	Unknown	US	234.25	9.62	4.28	2959255	0	yahoo	2026-03-24 14:42:24.470072+05:30
1117	INTU	INTU	Unknown	US	457.02	1.46	0.32	3027682	0	yahoo	2026-03-24 14:42:24.470072+05:30
1118	CB	CB	Unknown	US	326.37	3.79	1.17	1283555	0	yahoo	2026-03-24 14:42:24.470072+05:30
1119	ACN	ACN	Unknown	US	200.02	0.03	0.02	3870563	0	yahoo	2026-03-24 14:42:24.470072+05:30
1120	PGR	PGR	Unknown	US	205.1	-0.9	-0.44	2546221	0	yahoo	2026-03-24 14:42:24.470072+05:30
1121	PLD	PLD	Unknown	US	130.31	2.3	1.8	2311004	0	yahoo	2026-03-24 14:42:24.470072+05:30
1122	BMY	BMY	Unknown	US	57	-0.48	-0.84	7768761	0	yahoo	2026-03-24 14:42:24.470072+05:30
1123	NOW	NOW	Unknown	US	110.95	0.57	0.52	12095505	0	yahoo	2026-03-24 14:42:24.470072+05:30
1124	VRTX	VRTX	Unknown	US	451.23	-2.77	-0.61	1152006	0	yahoo	2026-03-24 14:42:24.470072+05:30
1125	PH	PH	Unknown	US	906.06	11.65	1.3	868221	0	yahoo	2026-03-24 14:42:24.470072+05:30
1126	COF	COF	Unknown	US	184	2.54	1.4	5391991	0	yahoo	2026-03-24 14:42:24.470072+05:30
1127	MDT	MDT	Unknown	US	87.17	1.01	1.17	6901628	0	yahoo	2026-03-24 14:42:24.470072+05:30
1128	HCA	HCA	Unknown	US	494.58	0.7	0.14	1274788	0	yahoo	2026-03-24 14:42:24.470072+05:30
1129	CME	CME	Unknown	US	306.56	-0.76	-0.25	1790447	0	yahoo	2026-03-24 14:42:24.470072+05:30
1130	MCK	MCK	Unknown	US	877.01	-8.83	-1	477596	0	yahoo	2026-03-24 14:42:24.470072+05:30
1131	MO	MO	Unknown	US	64.39	-0.08	-0.12	8416327	0	yahoo	2026-03-24 14:42:24.470072+05:30
1132	GLW	GLW	Unknown	US	130.97	6.39	5.13	10162005	0	yahoo	2026-03-24 14:42:24.470072+05:30
1133	SBUX	SBUX	Unknown	US	93.83	1.28	1.38	7437265	0	yahoo	2026-03-24 14:42:24.470072+05:30
1134	SNDK	SNDK	Unknown	US	702.49	-7.22	-1.02	22780809	0	yahoo	2026-03-24 14:42:24.470072+05:30
1135	SO	SO	Unknown	US	93.75	0.36	0.39	4060898	0	yahoo	2026-03-24 14:42:24.470072+05:30
1136	CMCSA	CMCSA	Unknown	US	29.01	-0.01	-0.03	31471430	0	yahoo	2026-03-24 14:42:24.470072+05:30
1137	NEM	NEM	Unknown	US	98.14	2.34	2.44	17380742	0	yahoo	2026-03-24 14:42:24.470072+05:30
1138	CRWD	CRWD	Unknown	US	413.31	4.31	1.05	3448563	0	yahoo	2026-03-24 14:42:24.470072+05:30
1139	BSX	BSX	Unknown	US	69.54	0.06	0.09	8604213	0	yahoo	2026-03-24 14:42:24.470072+05:30
1140	CEG	CEG	Unknown	US	289.76	7.77	2.76	2715806	0	yahoo	2026-03-24 14:42:24.470072+05:30
1141	DELL	DELL	Unknown	US	164.59	6.92	4.39	10701628	0	yahoo	2026-03-24 14:42:24.470072+05:30
1142	ADBE	ADBE	Unknown	US	247.64	-0.51	-0.21	3866050	0	yahoo	2026-03-24 14:42:24.470072+05:30
1143	NOC	NOC	Unknown	US	680	-26.95	-3.81	1225759	0	yahoo	2026-03-24 14:42:24.470072+05:30
1144	WDC	WDC	Unknown	US	294.79	1.69	0.58	8869958	0	yahoo	2026-03-24 14:42:24.470072+05:30
1145	DUK	DUK	Unknown	US	127.34	0.53	0.42	3581975	0	yahoo	2026-03-24 14:42:24.470072+05:30
1146	EQIX	EQIX	Unknown	US	966.96	7.8	0.81	525672	0	yahoo	2026-03-24 14:42:24.470072+05:30
1147	GD	GD	Unknown	US	347.37	1.59	0.46	815000	0	yahoo	2026-03-24 14:42:24.470072+05:30
1148	WM	WM	Unknown	US	227.53	-3.71	-1.6	1562769	0	yahoo	2026-03-24 14:42:24.470072+05:30
1149	HWM	HWM	Unknown	US	236.04	4.83	2.09	2226855	0	yahoo	2026-03-24 14:42:24.470072+05:30
1150	STX	STX	Unknown	US	404.02	-7.21	-1.75	3604555	0	yahoo	2026-03-24 14:42:24.470072+05:30
1151	CVS	CVS	Unknown	US	71.29	-0.19	-0.27	6601139	0	yahoo	2026-03-24 14:42:24.470072+05:30
1152	TT	TT	Unknown	US	424.94	14.58	3.55	1090130	0	yahoo	2026-03-24 14:42:24.470072+05:30
1153	ICE	ICE	Unknown	US	157.17	-1.26	-0.8	2526895	0	yahoo	2026-03-24 14:42:24.470072+05:30
1154	WMB	WMB	Unknown	US	73.6	1.19	1.64	6518894	0	yahoo	2026-03-24 14:42:24.470072+05:30
1155	BX	BX	Unknown	US	109.35	-1.08	-0.98	6486455	0	yahoo	2026-03-24 14:42:24.470072+05:30
1156	MRSH	MRSH	Unknown	US	173.87	-2.61	-1.48	1982619	0	yahoo	2026-03-24 14:42:24.470072+05:30
1157	MAR	MAR	Unknown	US	326.52	6.76	2.11	1856399	0	yahoo	2026-03-24 14:42:24.470072+05:30
1158	FDX	FDX	Unknown	US	355.78	-3.07	-0.86	2518131	0	yahoo	2026-03-24 14:42:24.470072+05:30
1159	ADP	ADP	Unknown	US	209.71	1.02	0.49	3623171	0	yahoo	2026-03-24 14:42:24.470072+05:30
1160	PWR	PWR	Unknown	US	567.45	12.06	2.17	1217265	0	yahoo	2026-03-24 14:42:24.470072+05:30
1161	AMT	AMT	Unknown	US	176.5	-0.29	-0.16	2937796	0	yahoo	2026-03-24 14:42:24.470072+05:30
1162	UPS	UPS	Unknown	US	97.67	1.81	1.89	4274322	0	yahoo	2026-03-24 14:42:24.470072+05:30
1163	PNC	PNC	Unknown	US	203.93	2.22	1.1	1981322	0	yahoo	2026-03-24 14:42:24.470072+05:30
1164	SNPS	SNPS	Unknown	US	432.48	12.16	2.89	2508244	0	yahoo	2026-03-24 14:42:24.470072+05:30
1165	KKR	KKR	Unknown	US	90.84	0.84	0.93	5808114	0	yahoo	2026-03-24 14:42:24.470072+05:30
1166	USB	USB	Unknown	US	51.52	0.27	0.53	8987015	0	yahoo	2026-03-24 14:42:24.470072+05:30
1167	JCI	JCI	Unknown	US	133.27	3.57	2.75	1993343	0	yahoo	2026-03-24 14:42:24.470072+05:30
1168	BK	BK	Unknown	US	116.36	1.42	1.24	2702793	0	yahoo	2026-03-24 14:42:24.470072+05:30
1169	CDNS	CDNS	Unknown	US	292.52	8.62	3.04	3531605	0	yahoo	2026-03-24 14:42:24.470072+05:30
1170	NKE	NKE	Unknown	US	52.71	0.34	0.65	13153257	0	yahoo	2026-03-24 14:42:24.470072+05:30
1171	REGN	REGN	Unknown	US	736.53	3.66	0.5	510002	0	yahoo	2026-03-24 14:42:24.470072+05:30
1172	MCO	MCO	Unknown	US	441.07	5.95	1.37	1051803	0	yahoo	2026-03-24 14:42:24.470072+05:30
1173	ABNB	ABNB	Unknown	US	132.59	4.07	3.17	3172524	0	yahoo	2026-03-24 14:42:24.470072+05:30
1174	SHW	SHW	Unknown	US	313.95	10.42	3.43	1527085	0	yahoo	2026-03-24 14:42:24.470072+05:30
1175	MSI	MSI	Unknown	US	456.64	4.29	0.95	662610	0	yahoo	2026-03-24 14:42:24.470072+05:30
1176	FCX	FCX	Unknown	US	54.94	2.85	5.47	21129058	0	yahoo	2026-03-24 14:42:24.470072+05:30
1177	EOG	EOG	Unknown	US	139.68	0.95	0.68	4402628	0	yahoo	2026-03-24 14:42:24.470072+05:30
1178	MMM	MMM	Unknown	US	146.56	5.36	3.8	4795011	0	yahoo	2026-03-24 14:42:24.470072+05:30
1179	ITW	ITW	Unknown	US	262.75	5.07	1.97	1192118	0	yahoo	2026-03-24 14:42:24.471827+05:30
1180	CMI	CMI	Unknown	US	548.25	14.71	2.76	671670	0	yahoo	2026-03-24 14:42:24.471827+05:30
1181	ORLY	ORLY	Unknown	US	88.7	1.4	1.6	8439970	0	yahoo	2026-03-24 14:42:24.471827+05:30
1182	KMI	KMI	Unknown	US	33.71	0.87	2.65	18602977	0	yahoo	2026-03-24 14:42:24.471827+05:30
1183	ECL	ECL	Unknown	US	261.13	4.65	1.81	1745143	0	yahoo	2026-03-24 14:42:24.471827+05:30
1184	MNST	MNST	Unknown	US	73.96	0.27	0.37	4328115	0	yahoo	2026-03-24 14:42:24.471827+05:30
1185	MDLZ	MDLZ	Unknown	US	56.86	0.65	1.16	12614904	0	yahoo	2026-03-24 14:42:24.471827+05:30
1186	EMR	EMR	Unknown	US	129.83	1.68	1.31	4003040	0	yahoo	2026-03-24 14:42:24.471827+05:30
1187	CTAS	CTAS	Unknown	US	181.21	1.87	1.04	2552821	0	yahoo	2026-03-24 14:42:24.471827+05:30
1188	VLO	VLO	Unknown	US	237.39	-2.47	-1.03	2924438	0	yahoo	2026-03-24 14:42:24.471827+05:30
1189	RCL	RCL	Unknown	US	278.96	15.31	5.81	2985470	0	yahoo	2026-03-24 14:42:24.471827+05:30
1190	CSX	CSX	Unknown	US	38.94	0.77	2.02	11956125	0	yahoo	2026-03-24 14:42:24.471827+05:30
1191	PSX	PSX	Unknown	US	176.76	1.29	0.74	3060850	0	yahoo	2026-03-24 14:42:24.471827+05:30
1192	SLB	SLB	Unknown	US	49.25	2.62	5.62	25757246	0	yahoo	2026-03-24 14:42:24.471827+05:30
1193	AON	AON	Unknown	US	325.97	0.34	0.1	912751	0	yahoo	2026-03-24 14:42:24.471827+05:30
1194	CI	CI	Unknown	US	261.49	-1.35	-0.51	1520995	0	yahoo	2026-03-24 14:42:24.471827+05:30
1195	MPC	MPC	Unknown	US	232.53	0	0	2188821	0	yahoo	2026-03-24 14:42:24.471827+05:30
1196	ROST	ROST	Unknown	US	213.09	1.9	0.9	1820177	0	yahoo	2026-03-24 14:42:24.471827+05:30
1197	CL	CL	Unknown	US	85.15	0.03	0.04	6433340	0	yahoo	2026-03-24 14:42:24.471827+05:30
1198	DASH	DASH	Unknown	US	159.98	3.34	2.13	3597971	0	yahoo	2026-03-24 14:42:24.471827+05:30
1199	WBD	WBD	Unknown	US	27.4	-0.02	-0.07	29450172	0	yahoo	2026-03-24 14:42:24.471827+05:30
1200	AEP	AEP	Unknown	US	127.92	2.26	1.8	3961180	0	yahoo	2026-03-24 14:42:24.471827+05:30
1201	RSG	RSG	Unknown	US	216.73	-2.57	-1.17	1745496	0	yahoo	2026-03-24 14:42:24.471827+05:30
1202	CRH	CRH	Unknown	US	104.42	3.95	3.93	4901422	0	yahoo	2026-03-24 14:42:24.471827+05:30
1203	HLT	HLT	Unknown	US	300.67	8.09	2.77	1587168	0	yahoo	2026-03-24 14:42:24.471827+05:30
1204	TDG	TDG	Unknown	US	1152.97	-24.42	-2.07	393245	0	yahoo	2026-03-24 14:42:24.471827+05:30
1205	LHX	LHX	Unknown	US	345.48	-7.37	-2.09	1597190	0	yahoo	2026-03-24 14:42:24.472321+05:30
1206	GM	GM	Unknown	US	75.72	2.91	4	5791549	0	yahoo	2026-03-24 14:42:24.472321+05:30
1207	APO	APO	Unknown	US	110.45	-1.55	-1.38	6091248	0	yahoo	2026-03-24 14:42:24.472321+05:30
1208	ELV	ELV	Unknown	US	289.24	-2.24	-0.77	1348774	0	yahoo	2026-03-24 14:42:24.472321+05:30
1209	TRV	TRV	Unknown	US	295.52	-1.08	-0.36	972127	0	yahoo	2026-03-24 14:42:24.472321+05:30
1210	HOOD	HOOD	Unknown	US	72.49	1.6	2.26	24455775	0	yahoo	2026-03-24 14:42:24.472321+05:30
1211	COR	COR	Unknown	US	320.61	-6.3	-1.93	948549	0	yahoo	2026-03-24 14:42:24.472321+05:30
1212	NSC	NSC	Unknown	US	284.95	3.86	1.37	516704	0	yahoo	2026-03-24 14:42:24.472321+05:30
1213	APD	APD	Unknown	US	278.66	-2.35	-0.84	954833	0	yahoo	2026-03-24 14:42:24.472321+05:30
1214	FTNT	FTNT	Unknown	US	82.77	1.37	1.68	4553777	0	yahoo	2026-03-24 14:42:24.472321+05:30
1215	SPG	SPG	Unknown	US	181.49	-3.03	-1.64	2512132	0	yahoo	2026-03-24 14:42:24.472321+05:30
1216	SRE	SRE	Unknown	US	93.46	1.74	1.9	1793148	0	yahoo	2026-03-24 14:42:24.472321+05:30
1217	OXY	OXY	Unknown	US	60.31	-0.4	-0.66	22284047	0	yahoo	2026-03-24 14:42:24.472321+05:30
1218	BKR	BKR	Unknown	US	62.53	2.18	3.61	11296424	0	yahoo	2026-03-24 14:42:24.472321+05:30
1219	DLR	DLR	Unknown	US	176.47	3.17	1.83	1469590	0	yahoo	2026-03-24 14:42:24.472321+05:30
1220	PCAR	PCAR	Unknown	US	114.32	3.06	2.75	2612790	0	yahoo	2026-03-24 14:42:24.472321+05:30
1221	TEL	TEL	Unknown	US	200.79	4.95	2.53	1645125	0	yahoo	2026-03-24 14:42:24.472321+05:30
1222	O	O	Unknown	US	60.85	-0.1	-0.16	7378729	0	yahoo	2026-03-24 14:42:24.472321+05:30
1223	OKE	OKE	Unknown	US	89.92	0.71	0.8	4097507	0	yahoo	2026-03-24 14:42:24.472321+05:30
1224	AJG	AJG	Unknown	US	216.74	1.92	0.89	2045741	0	yahoo	2026-03-24 14:42:24.472321+05:30
1225	AFL	AFL	Unknown	US	106.65	0.43	0.4	2235789	0	yahoo	2026-03-24 14:42:24.472321+05:30
1226	TFC	TFC	Unknown	US	44.86	0.7	1.59	9790432	0	yahoo	2026-03-24 14:42:24.472321+05:30
1227	CIEN	CIEN	Unknown	US	407.9	24.01	6.25	3539250	0	yahoo	2026-03-24 14:42:24.472321+05:30
1228	AZO	AZO	Unknown	US	3353.24	70.34	2.14	147484	0	yahoo	2026-03-24 14:42:24.472321+05:30
1229	FANG	FANG	Unknown	US	191.78	-0.76	-0.39	3082825	0	yahoo	2026-03-24 14:42:24.472321+05:30
1230	ALL	ALL	Unknown	US	207.76	2.14	1.04	795077	0	yahoo	2026-03-24 14:42:24.472321+05:30
\.


--
-- Data for Name: mlops_predictionrun; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mlops_predictionrun (id, model_type, prediction, metrics, mlflow_run_id, created_at, created_by_id, stock_id) FROM stdin;
\.


--
-- Data for Name: mlops_stockcluster; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.mlops_stockcluster (id, cluster_label, feature_vector, created_at, created_by_id, stock_id, portfolio_id) FROM stdin;
1	0	{"pe": 0.0, "roe": 0.0, "market_cap": 0.0}	2026-03-24 11:27:56.514888+05:30	1	1	1
2	0	{"pe": 0.0, "roe": 0.0, "market_cap": 0.0}	2026-03-24 11:27:56.526113+05:30	1	2	1
3	0	{"pe": 0.0, "roe": 0.0, "market_cap": 0.0}	2026-03-24 11:27:56.529116+05:30	1	3	1
\.


--
-- Data for Name: otp_otp; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.otp_otp (id, code, created_at, is_used, user_id) FROM stdin;
\.


--
-- Data for Name: portfolio_holding; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.portfolio_holding (id, portfolio_id, stock_id, quantity, average_buy_price, updated_at) FROM stdin;
1	6	4	5.0000	977.4000	2026-03-29 20:48:27.828846
\.


--
-- Data for Name: portfolio_portfolio; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.portfolio_portfolio (id, name, created_at, user_id, description, is_default, sector, is_automated, target_allocation) FROM stdin;
1	MyPortfolio	2026-03-23 16:05:48.974249+05:30	1	\N	f	\N	f	{}
2	Conservative Growth	2026-03-30 00:10:15.825377+05:30	\N	Low-risk portfolio focused on dividend-paying stocks and stable growth. Ideal for risk-averse investors.	t	\N	f	{"Bonds": 10, "Mid Cap": 30, "Large Cap": 50, "Small Cap": 10}
3	Balanced Portfolio	2026-03-30 00:10:15.842021+05:30	\N	A balanced mix of growth and value stocks with moderate risk. Recommended for most investors.	t	\N	f	{"Mid Cap": 35, "Large Cap": 40, "Small Cap": 20, "International": 5}
4	Aggressive Growth	2026-03-30 00:10:15.848175+05:30	\N	High-growth portfolio focused on emerging sectors and small-cap stocks. For experienced, risk-tolerant investors.	t	\N	f	{"Mid Cap": 35, "Small Cap": 20, "Emerging Markets": 5, "Tech & Innovation": 40}
5	Index Tracker	2026-03-30 00:10:15.848175+05:30	\N	Follows market indices with low fees. Passive investment strategy for long-term wealth building.	t	\N	f	{"Nifty 50": 50, "Bank Nifty": 20, "Nifty Next 50": 30}
6	Dividend Harvester	2026-03-30 00:10:15.851813+05:30	\N	Portfolio of high dividend-yielding stocks for regular income. Suitable for investors seeking cash flow.	t	\N	f	{"Blue Chip": 50, "REITs & InvITs": 10, "Dividend Stocks": 40}
7	myportfolio	2026-03-30 01:10:52.380647+05:30	18		f	\N	f	{}
\.


--
-- Data for Name: portfolio_portfoliostock; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.portfolio_portfoliostock (id, quantity, average_buy_price, updated_at, portfolio_id, stock_id) FROM stdin;
1	1.0000	123.00	2026-03-23 16:38:26.750023+05:30	1	1
2	1.0000	123.00	2026-03-23 16:38:34.905157+05:30	1	2
3	1.0000	170.00	2026-03-24 11:27:46.903889+05:30	1	3
\.


--
-- Data for Name: socialaccount_socialaccount; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.socialaccount_socialaccount (id, provider, uid, last_login, date_joined, extra_data, user_id) FROM stdin;
\.


--
-- Data for Name: socialaccount_socialapp; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.socialaccount_socialapp (id, provider, name, client_id, secret, key, provider_id, settings) FROM stdin;
\.


--
-- Data for Name: socialaccount_socialapp_sites; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.socialaccount_socialapp_sites (id, socialapp_id, site_id) FROM stdin;
\.


--
-- Data for Name: socialaccount_socialtoken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.socialaccount_socialtoken (id, token, token_secret, expires_at, account_id, app_id) FROM stdin;
\.


--
-- Data for Name: stocks_fundamental; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stocks_fundamental (id, pe_ratio, roe, market_cap, updated_at, stock_id) FROM stdin;
\.


--
-- Data for Name: stocks_stockmaster; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stocks_stockmaster (id, symbol, name, sector, high_52week, low_52week, pe_ratio, market) FROM stdin;
5	ABB.NS	ABB India Ltd.	Capital Goods	6554.00	4637.50	\N	NSE
6	ACC.NS	ACC Ltd.	Construction Materials	2119.90	1305.00	\N	NSE
8	AUBANK.NS	AU Small Finance Bank Ltd.	Financial Services	1039.20	513.50	\N	NSE
9	ADANIENSOL.NS	Adani Energy Solutions Ltd.	Power	1067.70	744.90	\N	NSE
10	ADANIENT.NS	Adani Enterprises Ltd.	Metals & Mining	2695.00	1813.70	\N	NSE
2	ADANIGREEN.NS	ADANIGREEN	Unknown	1177.55	765.00	\N	NSE
1	ADANIPORTS.NS	ADANIPORTS	Unknown	1584.00	1041.50	\N	NSE
12	ATGL.NS	Adani Total Gas Ltd.	Oil Gas & Consumable Fuels	798.00	462.80	\N	NSE
13	ABCAPITAL.NS	Aditya Birla Capital Ltd.	Financial Services	369.30	169.43	\N	NSE
14	ALKEM.NS	Alkem Laboratories Ltd.	Healthcare	5933.50	4611.85	\N	NSE
15	AMBUJACEM.NS	Ambuja Cements Ltd.	Construction Materials	624.95	394.00	\N	NSE
3	APOLLOHOSP.NS	APOLLOHOSP	Unknown	8099.50	6490.85	\N	NSE
17	ASIANPAINT.NS	Asian Paints Ltd.	Consumer Durables	2985.70	2115.00	\N	NSE
18	ASTRAL.NS	Astral Ltd.	Capital Goods	1768.70	1244.05	\N	NSE
19	AUROPHARMA.NS	Aurobindo Pharma Ltd.	Healthcare	1330.00	1010.00	\N	NSE
20	DMART.NS	Avenue Supermarts Ltd.	Consumer Services	4949.50	3600.00	\N	NSE
22	BSE.NS	BSE Ltd.	Financial Services	3227.00	1659.45	\N	NSE
23	BAJAJ-AUTO.NS	Bajaj Auto Ltd.	Automobile and Auto Components	10187.00	7089.35	\N	NSE
24	BAJFINANCE.NS	Bajaj Finance Ltd.	Financial Services	1102.50	787.90	\N	NSE
25	BAJAJFINSV.NS	Bajaj Finserv Ltd.	Financial Services	2195.00	1662.70	\N	NSE
27	BAJAJHFL.NS	Bajaj Housing Finance Ltd.	Financial Services	136.96	75.00	\N	NSE
28	BANKBARODA.NS	Bank of Baroda	Financial Services	325.50	212.55	\N	NSE
29	BANKINDIA.NS	Bank of India	Financial Services	178.36	103.00	\N	NSE
30	BDL.NS	Bharat Dynamics Ltd.	Capital Goods	2096.60	1131.20	\N	NSE
31	BEL.NS	Bharat Electronics Ltd.	Capital Goods	473.45	256.20	\N	NSE
32	BHARATFORG.NS	Bharat Forge Ltd.	Automobile and Auto Components	1935.50	919.10	\N	NSE
33	BHEL.NS	Bharat Heavy Electricals Ltd.	Capital Goods	305.90	193.50	\N	NSE
35	BHARTIARTL.NS	Bharti Airtel Ltd.	Telecommunication	2174.50	1669.40	\N	NSE
36	BHARTIHEXA.NS	Bharti Hexacom Ltd.	Telecommunication	2052.90	1260.00	\N	NSE
37	BIOCON.NS	Biocon Ltd.	Healthcare	424.95	299.00	\N	NSE
38	BLUESTARCO.NS	Blue Star Ltd.	Consumer Durables	2148.75	1521.00	\N	NSE
39	BOSCHLTD.NS	Bosch Ltd.	Automobile and Auto Components	41945.00	25921.60	\N	NSE
41	CGPOWER.NS	CG Power and Industrial Solutions Ltd.	Capital Goods	797.55	517.70	\N	NSE
42	CANBK.NS	Canara Bank	Financial Services	162.89	83.70	\N	NSE
43	CHOLAFIN.NS	Cholamandalam Investment and Finance Company Ltd.	Financial Services	1831.50	1358.65	\N	NSE
44	CIPLA.NS	Cipla Ltd.	Healthcare	1673.00	1216.60	\N	NSE
45	COALINDIA.NS	Coal India Ltd.	Oil Gas & Consumable Fuels	476.00	356.00	\N	NSE
46	COCHINSHIP.NS	Cochin Shipyard Ltd.	Capital Goods	2545.00	1224.55	\N	NSE
47	COFORGE.NS	Coforge Ltd.	Information Technology	1994.00	1008.10	\N	NSE
49	CONCOR.NS	Container Corporation of India Ltd.	Services	652.04	421.45	\N	NSE
50	COROMANDEL.NS	Coromandel International Ltd.	Chemicals	2718.90	1818.10	\N	NSE
51	CUMMINSIND.NS	Cummins India Ltd.	Capital Goods	4987.00	2580.00	\N	NSE
52	DLF.NS	DLF Ltd.	Realty	886.80	512.05	\N	NSE
53	DABUR.NS	Dabur India Ltd.	Fast Moving Consumer Goods	577.00	416.05	\N	NSE
54	DIVISLAB.NS	Divi's Laboratories Ltd.	Healthcare	7071.50	4955.00	\N	NSE
56	DRREDDY.NS	Dr. Reddy's Laboratories Ltd.	Healthcare	1379.70	1020.00	\N	NSE
57	EICHERMOT.NS	Eicher Motors Ltd.	Automobile and Auto Components	8230.00	4999.95	\N	NSE
58	ETERNAL.NS	Eternal Ltd.	Consumer Services	368.45	194.80	\N	NSE
59	EXIDEIND.NS	Exide Industries Ltd.	Automobile and Auto Components	431.00	290.00	\N	NSE
60	NYKAA.NS	FSN E-Commerce Ventures Ltd.	Consumer Services	285.60	165.97	\N	NSE
61	FEDERALBNK.NS	Federal Bank Ltd.	Financial Services	302.00	183.15	\N	NSE
62	FORTIS.NS	Fortis Healthcare Ltd.	Healthcare	1104.30	595.80	\N	NSE
64	GMRAIRPORT.NS	GMR Airports Ltd.	Services	110.36	75.83	\N	NSE
65	GLENMARK.NS	Glenmark Pharmaceuticals Ltd.	Healthcare	2297.90	1336.00	\N	NSE
66	GODFRYPHLP.NS	Godfrey Phillips India Ltd.	Fast Moving Consumer Goods	3947.00	1832.10	\N	NSE
67	GODREJCP.NS	Godrej Consumer Products Ltd.	Fast Moving Consumer Goods	1309.00	988.00	\N	NSE
68	GODREJPROP.NS	Godrej Properties Ltd.	Realty	2506.50	1476.20	\N	NSE
70	HCLTECH.NS	HCL Technologies Ltd.	Information Technology	1780.10	1297.70	\N	NSE
71	HDFCAMC.NS	HDFC Asset Management Company Ltd.	Financial Services	2967.25	1783.43	\N	NSE
72	HDFCBANK.NS	HDFC Bank Ltd.	Financial Services	1020.50	741.05	\N	NSE
73	HDFCLIFE.NS	HDFC Life Insurance Company Ltd.	Financial Services	820.75	590.05	\N	NSE
74	HAVELLS.NS	Havells India Ltd.	Consumer Durables	1673.80	1217.20	\N	NSE
76	HINDALCO.NS	Hindalco Industries Ltd.	Metals & Mining	1029.80	546.45	\N	NSE
77	HAL.NS	Hindustan Aeronautics Ltd.	Capital Goods	5165.00	3576.10	\N	NSE
78	HINDPETRO.NS	Hindustan Petroleum Corporation Ltd.	Oil Gas & Consumable Fuels	508.45	316.20	\N	NSE
79	HINDUNILVR.NS	Hindustan Unilever Ltd.	Fast Moving Consumer Goods	2750.00	2033.30	\N	NSE
80	HINDZINC.NS	Hindustan Zinc Ltd.	Metals & Mining	733.00	388.55	\N	NSE
81	POWERINDIA.NS	Hitachi Energy India Ltd.	Capital Goods	26325.00	10400.00	\N	NSE
82	HUDCO.NS	Housing & Urban Development Corporation Ltd.	Financial Services	253.73	164.00	\N	NSE
84	ICICIBANK.NS	ICICI Bank Ltd.	Financial Services	1500.00	1218.10	\N	NSE
85	ICICIGI.NS	ICICI Lombard General Insurance Company Ltd.	Financial Services	2068.70	1702.00	\N	NSE
87	IRB.NS	IRB Infrastructure Developers Ltd.	Construction	54.28	19.89	\N	NSE
88	ITCHOTELS.NS	ITC Hotels Ltd.	Consumer Services	261.62	138.96	\N	NSE
89	ITC.NS	ITC Ltd.	Fast Moving Consumer Goods	444.20	288.75	\N	NSE
91	INDHOTEL.NS	Indian Hotels Co. Ltd.	Consumer Services	853.35	580.85	\N	NSE
92	IOC.NS	Indian Oil Corporation Ltd.	Oil Gas & Consumable Fuels	188.96	122.35	\N	NSE
93	IRCTC.NS	Indian Railway Catering And Tourism Corporation Ltd.	Consumer Services	820.25	504.85	\N	NSE
94	IRFC.NS	Indian Railway Finance Corporation Ltd.	Financial Services	148.95	89.20	\N	NSE
96	IGL.NS	Indraprastha Gas Ltd.	Oil Gas & Consumable Fuels	229.00	146.60	\N	NSE
97	INDUSTOWER.NS	Indus Towers Ltd.	Telecommunication	481.50	312.55	\N	NSE
98	INDUSINDBK.NS	IndusInd Bank Ltd.	Financial Services	968.85	637.00	\N	NSE
99	NAUKRI.NS	Info Edge (India) Ltd.	Consumer Services	1550.00	930.50	\N	NSE
100	INFY.NS	Infosys Ltd.	Information Technology	1728.00	1215.10	\N	NSE
101	INDIGO.NS	InterGlobe Aviation Ltd.	Services	6232.50	3895.20	\N	NSE
102	JSWENERGY.NS	JSW Energy Ltd.	Power	557.40	427.75	\N	NSE
104	JINDALSTEL.NS	Jindal Steel Ltd.	Metals & Mining	1272.10	770.00	\N	NSE
105	JIOFIN.NS	Jio Financial Services Ltd.	Financial Services	338.60	203.10	\N	NSE
106	JUBLFOOD.NS	Jubilant Foodworks Ltd.	Consumer Services	727.95	436.20	\N	NSE
107	KEI.NS	KEI Industries Ltd.	Capital Goods	5303.00	2424.00	\N	NSE
108	KPITTECH.NS	KPIT Technologies Ltd.	Information Technology	1434.50	624.90	\N	NSE
110	KOTAKBANK.NS	Kotak Mahindra Bank Ltd.	Financial Services	460.38	355.25	\N	NSE
111	LTF.NS	L&T Finance Ltd.	Financial Services	329.45	140.00	\N	NSE
112	LICHSGFIN.NS	LIC Housing Finance Ltd.	Financial Services	646.50	458.90	\N	NSE
113	LTM.NS	LTIMindtree Ltd.	Information Technology	5195.00	4048.00	\N	NSE
114	LT.NS	Larsen & Toubro Ltd.	Construction	4440.00	2965.30	\N	NSE
116	LODHA.NS	Lodha Developers Ltd.	Realty	1531.00	691.85	\N	NSE
117	LUPIN.NS	Lupin Ltd.	Healthcare	2377.60	1795.20	\N	NSE
118	MRF.NS	MRF Ltd.	Automobile and Auto Components	163600.00	108001.00	\N	NSE
119	M&MFIN.NS	Mahindra & Mahindra Financial Services Ltd.	Financial Services	412.20	236.24	\N	NSE
120	M&M.NS	Mahindra & Mahindra Ltd.	Automobile and Auto Components	3839.90	2425.00	\N	NSE
121	MANKIND.NS	Mankind Pharma Ltd.	Healthcare	2716.50	1909.70	\N	NSE
122	MARICO.NS	Marico Ltd.	Fast Moving Consumer Goods	813.50	641.00	\N	NSE
124	MFSL.NS	Max Financial Services Ltd.	Financial Services	1892.50	1085.00	\N	NSE
125	MAXHEALTH.NS	Max Healthcare Institute Ltd.	Healthcare	1314.30	933.80	\N	NSE
126	MAZDOCK.NS	Mazagoan Dock Shipbuilders Ltd.	Capital Goods	3775.00	2125.90	\N	NSE
127	MOTILALOFS.NS	Motilal Oswal Financial Services Ltd.	Financial Services	1097.10	513.00	\N	NSE
128	MPHASIS.NS	MphasiS Ltd.	Information Technology	3037.20	2030.50	\N	NSE
129	MUTHOOTFIN.NS	Muthoot Finance Ltd.	Financial Services	4149.50	1965.00	\N	NSE
130	NHPC.NS	NHPC Ltd.	Power	92.34	71.62	\N	NSE
132	NTPCGREEN.NS	NTPC Green Energy Ltd.	Power	117.64	84.00	\N	NSE
133	NTPC.NS	NTPC Ltd.	Power	394.50	315.55	\N	NSE
134	NATIONALUM.NS	National Aluminium Co. Ltd.	Metals & Mining	431.50	137.75	\N	NSE
136	OBEROIRLTY.NS	Oberoi Realty Ltd.	Realty	2005.00	1391.20	\N	NSE
137	ONGC.NS	Oil & Natural Gas Corporation Ltd.	Oil Gas & Consumable Fuels	293.00	205.00	\N	NSE
138	OIL.NS	Oil India Ltd.	Oil Gas & Consumable Fuels	524.00	325.00	\N	NSE
139	PAYTM.NS	One 97 Communications Ltd.	Financial Services	1381.80	753.10	\N	NSE
140	OFSS.NS	Oracle Financial Services Software Ltd.	Information Technology	9950.00	6234.50	\N	NSE
141	POLICYBZR.NS	PB Fintech Ltd.	Financial Services	1978.00	1364.00	\N	NSE
142	PIIND.NS	PI Industries Ltd.	Chemicals	4330.00	2750.10	\N	NSE
143	PAGEIND.NS	Page Industries Ltd.	Textiles	50590.00	29805.00	\N	NSE
145	PERSISTENT.NS	Persistent Systems Ltd.	Information Technology	6599.00	4148.95	\N	NSE
146	PHOENIXLTD.NS	Phoenix Mills Ltd.	Realty	1993.00	1402.50	\N	NSE
147	PIDILITIND.NS	Pidilite Industries Ltd.	Chemicals	1574.95	1293.30	\N	NSE
148	POLYCAB.NS	Polycab India Ltd.	Capital Goods	8722.00	4567.00	\N	NSE
149	PFC.NS	Power Finance Corporation Ltd.	Financial Services	444.10	329.90	\N	NSE
151	PREMIERENE.NS	Premier Energies Ltd.	Capital Goods	1163.90	666.90	\N	NSE
152	PRESTIGE.NS	Prestige Estates Projects Ltd.	Realty	1814.00	1048.05	\N	NSE
153	PNB.NS	Punjab National Bank	Financial Services	135.15	89.45	\N	NSE
154	RECLTD.NS	REC Ltd.	Financial Services	448.00	310.55	\N	NSE
155	RVNL.NS	Rail Vikas Nigam Ltd.	Construction	447.80	249.10	\N	NSE
157	SBICARD.NS	SBI Cards and Payment Services Ltd.	Financial Services	1027.25	650.05	\N	NSE
158	SBILIFE.NS	SBI Life Insurance Company Ltd.	Financial Services	2132.00	1430.55	\N	NSE
159	SRF.NS	SRF Ltd.	Chemicals	3325.00	2381.00	\N	NSE
160	MOTHERSON.NS	Samvardhana Motherson International Ltd.	Automobile and Auto Components	136.15	71.50	\N	NSE
161	SHREECEM.NS	Shree Cement Ltd.	Construction Materials	32490.00	22550.00	\N	NSE
162	SHRIRAMFIN.NS	Shriram Finance Ltd.	Financial Services	1108.00	566.50	\N	NSE
163	ENRIN.NS	Siemens Energy India Ltd.	Capital Goods	3625.00	2115.00	\N	NSE
164	SIEMENS.NS	Siemens Ltd.	Capital Goods	3440.00	2450.00	\N	NSE
166	SONACOMS.NS	Sona BLW Precision Forgings Ltd.	Automobile and Auto Components	559.50	380.00	\N	NSE
167	SBIN.NS	State Bank of India	Financial Services	1234.70	730.00	\N	NSE
168	SAIL.NS	Steel Authority of India Ltd.	Metals & Mining	168.21	101.13	\N	NSE
169	SUNPHARMA.NS	Sun Pharmaceutical Industries Ltd.	Healthcare	1851.20	1548.00	\N	NSE
170	SUPREMEIND.NS	Supreme Industries Ltd.	Capital Goods	4739.00	3095.00	\N	NSE
4	360ONE.NS	360 ONE WAM Ltd.	Financial Services	1273.80	790.50	\N	NSE
7	APLAPOLLO.NS	APL Apollo Tubes Ltd.	Capital Goods	2301.40	1399.95	\N	NSE
11	ADANIPOWER.NS	Adani Power Ltd.	Power	182.70	92.40	\N	NSE
16	ASHOKLEY.NS	Ashok Leyland Ltd.	Capital Goods	215.42	95.93	\N	NSE
21	AXISBANK.NS	Axis Bank Ltd.	Financial Services	1418.30	1032.35	\N	NSE
26	BAJAJHLDNG.NS	Bajaj Holdings & Investment Ltd.	Financial Services	14763.00	9088.00	\N	NSE
34	BPCL.NS	Bharat Petroleum Corporation Ltd.	Oil Gas & Consumable Fuels	391.65	262.00	\N	NSE
40	BRITANNIA.NS	Britannia Industries Ltd.	Fast Moving Consumer Goods	6336.00	4605.05	\N	NSE
48	COLPAL.NS	Colgate Palmolive (India) Ltd.	Fast Moving Consumer Goods	2747.40	1838.10	\N	NSE
55	DIXON.NS	Dixon Technologies (India) Ltd.	Consumer Durables	18471.00	9630.00	\N	NSE
63	GAIL.NS	GAIL (India) Ltd.	Oil Gas & Consumable Fuels	202.79	134.36	\N	NSE
69	GRASIM.NS	Grasim Industries Ltd.	Construction Materials	2979.00	2465.50	\N	NSE
75	HEROMOTOCO.NS	Hero MotoCorp Ltd.	Automobile and Auto Components	6388.50	3344.00	\N	NSE
83	HYUNDAI.NS	Hyundai Motor India Ltd.	Automobile and Auto Components	2890.00	1541.70	\N	NSE
86	IDFCFIRSTB.NS	IDFC First Bank Ltd.	Financial Services	87.00	52.46	\N	NSE
90	INDIANB.NS	Indian Bank	Financial Services	1000.00	517.85	\N	NSE
95	IREDA.NS	Indian Renewable Energy Development Agency Ltd.	Financial Services	186.58	110.00	\N	NSE
103	JSWSTEEL.NS	JSW Steel Ltd.	Metals & Mining	1284.70	905.20	\N	NSE
109	KALYANKJIL.NS	Kalyan Jewellers India Ltd.	Consumer Durables	617.70	347.50	\N	NSE
115	LICI.NS	Life Insurance Corporation of India	Financial Services	980.00	737.05	\N	NSE
123	MARUTI.NS	Maruti Suzuki India Ltd.	Automobile and Auto Components	17370.00	11059.45	\N	NSE
131	NMDC.NS	NMDC Ltd.	Metals & Mining	86.72	59.53	\N	NSE
135	NESTLEIND.NS	Nestle India Ltd.	Fast Moving Consumer Goods	1340.40	1074.00	\N	NSE
144	PATANJALI.NS	Patanjali Foods Ltd.	Fast Moving Consumer Goods	670.33	460.40	\N	NSE
150	POWERGRID.NS	Power Grid Corporation of India Ltd.	Power	322.00	250.00	\N	NSE
156	RELIANCE.NS	Reliance Industries Ltd.	Oil Gas & Consumable Fuels	1611.80	1114.85	\N	NSE
165	SOLARINDS.NS	Solar Industries India Ltd.	Chemicals	17820.00	9888.40	\N	NSE
171	SUZLON.NS	Suzlon Energy Ltd.	Capital Goods	74.30	38.19	\N	NSE
172	SWIGGY.NS	Swiggy Ltd.	Consumer Services	474.00	266.30	\N	NSE
173	TVSMOTOR.NS	TVS Motor Company Ltd.	Automobile and Auto Components	3970.00	2221.10	\N	NSE
174	TATACOMM.NS	Tata Communications Ltd.	Telecommunication	2004.00	1361.60	\N	NSE
175	TCS.NS	Tata Consultancy Services Ltd.	Information Technology	3630.50	2348.00	\N	NSE
176	TATACONSUM.NS	Tata Consumer Products Ltd.	Fast Moving Consumer Goods	1220.90	989.25	\N	NSE
177	TATAELXSI.NS	Tata Elxsi Ltd.	Information Technology	6735.00	4021.60	\N	NSE
178	TMPV.NS	Tata Motors Passenger Vehicles Ltd.	Automobile and Auto Components	419.00	301.05	\N	NSE
179	TATAPOWER.NS	Tata Power Co. Ltd.	Power	418.45	335.00	\N	NSE
180	TATASTEEL.NS	Tata Steel Ltd.	Metals & Mining	216.45	125.30	\N	NSE
181	TATATECH.NS	Tata Technologies Ltd.	Information Technology	797.00	517.00	\N	NSE
182	TECHM.NS	Tech Mahindra Ltd.	Information Technology	1854.00	1209.40	\N	NSE
183	TITAN.NS	Titan Company Ltd.	Consumer Durables	4378.40	2925.00	\N	NSE
184	TORNTPHARM.NS	Torrent Pharmaceuticals Ltd.	Healthcare	4482.90	3101.60	\N	NSE
185	TORNTPOWER.NS	Torrent Power Ltd.	Power	1640.00	1188.00	\N	NSE
186	TRENT.NS	Trent Ltd.	Consumer Services	6261.00	3340.30	\N	NSE
187	TIINDIA.NS	Tube Investments of India Ltd.	Automobile and Auto Components	3419.90	2164.90	\N	NSE
188	UPL.NS	UPL Ltd.	Chemicals	812.20	588.85	\N	NSE
189	ULTRACEMCO.NS	UltraTech Cement Ltd.	Construction Materials	13110.00	10325.00	\N	NSE
190	UNIONBANK.NS	Union Bank of India	Financial Services	205.49	112.52	\N	NSE
191	UNITDSPR.NS	United Spirits Ltd.	Fast Moving Consumer Goods	1645.00	1250.60	\N	NSE
192	VBL.NS	Varun Beverages Ltd.	Fast Moving Consumer Goods	568.50	381.00	\N	NSE
193	VEDL.NS	Vedanta Ltd.	Metals & Mining	769.80	363.00	\N	NSE
194	VMM.NS	Vishal Mega Mart Ltd.	Consumer Services	157.60	96.30	\N	NSE
195	IDEA.NS	Vodafone Idea Ltd.	Telecommunication	12.80	6.12	\N	NSE
196	VOLTAS.NS	Voltas Ltd.	Consumer Durables	1582.50	1190.00	\N	NSE
197	WAAREEENER.NS	Waaree Energies Ltd.	Capital Goods	3865.00	1863.00	\N	NSE
198	WIPRO.NS	Wipro Ltd.	Information Technology	273.10	187.00	\N	NSE
199	YESBANK.NS	Yes Bank Ltd.	Financial Services	24.30	16.16	\N	NSE
200	ZYDUSLIFE.NS	Zydus Lifesciences Ltd.	Healthcare	1059.05	795.00	\N	NSE
201	AAPL	AAPL	Technology	\N	\N	\N	NASDAQ
202	MSFT	MSFT	Technology	\N	\N	\N	NASDAQ
203	GOOGL	GOOGL	Technology	\N	\N	\N	NASDAQ
204	AMZN	AMZN	Technology	\N	\N	\N	NASDAQ
205	META	META	Technology	\N	\N	\N	NASDAQ
206	TSLA	TSLA	Technology	\N	\N	\N	NASDAQ
207	NVDA	NVDA	Technology	\N	\N	\N	NASDAQ
208	JPM	JPM	Technology	\N	\N	\N	NASDAQ
209	JNJ	JNJ	Technology	\N	\N	\N	NASDAQ
210	V	V	Technology	\N	\N	\N	NASDAQ
211	BTC	BTCUSDT	Cryptocurrency	103433.30	32774.13	\N	CRYPTO
212	ETH	ETHUSDT	Cryptocurrency	3108.54	985.47	\N	CRYPTO
213	BNB	BNBUSDT	Cryptocurrency	945.03	302.93	\N	CRYPTO
214	SOL	SOLUSDT	Cryptocurrency	130.13	40.93	\N	CRYPTO
215	XRP	XRPUSDT	Cryptocurrency	2.05	0.66	\N	CRYPTO
216	ADA	ADAUSDT	Cryptocurrency	0.38	0.12	\N	CRYPTO
217	DOGE	DOGEUSDT	Cryptocurrency	0.14	0.04	\N	CRYPTO
218	DOT	DOTUSDT	Cryptocurrency	1.99	0.64	\N	CRYPTO
219	MATIC	MATICUSDT	Cryptocurrency	0.57	0.19	\N	CRYPTO
220	LTC	LTCUSDT	Cryptocurrency	82.77	26.63	\N	CRYPTO
\.


--
-- Data for Name: stocks_stockprice; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stocks_stockprice (id, "timestamp", open, high, low, close, volume, stock_id) FROM stdin;
1	2026-03-28 09:32:34.126636+05:30	998.00	998.90	969.80	977.40	602539	4
2	2026-03-28 09:32:34.582085+05:30	6190.00	6190.00	5987.00	6105.00	425645	5
3	2026-03-28 09:32:35.048241+05:30	1367.90	1367.90	1305.00	1314.40	480450	6
4	2026-03-28 09:32:35.533523+05:30	1970.10	2012.00	1965.70	1986.20	788888	7
5	2026-03-28 09:32:35.964109+05:30	900.00	907.90	877.25	882.75	3432522	8
6	2026-03-28 09:32:36.440922+05:30	985.00	986.00	953.50	956.00	1357130	9
7	2026-03-28 09:32:37.100515+05:30	1880.00	1883.20	1816.50	1823.00	2585257	10
8	2026-03-28 09:32:37.567778+05:30	850.45	850.45	825.90	832.50	2328454	2
9	2026-03-28 09:32:38.237097+05:30	1375.00	1375.00	1330.10	1337.80	2667313	1
10	2026-03-28 09:32:38.725714+05:30	153.50	155.28	151.56	153.92	23958053	11
11	2026-03-28 09:32:39.28224+05:30	521.95	553.50	511.50	529.10	11384740	12
12	2026-03-28 09:32:39.843874+05:30	311.40	311.50	301.45	305.75	4796034	13
13	2026-03-28 09:32:40.341855+05:30	5401.00	5419.50	5259.00	5344.50	145051	14
14	2026-03-28 09:32:40.876787+05:30	418.00	418.60	407.60	408.85	6114057	15
15	2026-03-28 09:32:41.476089+05:30	7510.00	7621.00	7510.00	7549.00	533512	3
16	2026-03-28 09:32:42.5301+05:30	170.00	170.00	162.85	163.09	21631702	16
17	2026-03-28 09:32:43.202541+05:30	2246.30	2269.00	2201.10	2207.40	1089010	17
18	2026-03-28 09:32:43.820638+05:30	1635.00	1653.90	1610.10	1619.10	790705	18
19	2026-03-28 09:32:44.442758+05:30	1307.80	1327.00	1296.00	1314.20	1923752	19
20	2026-03-28 09:32:44.946117+05:30	3900.00	3940.00	3865.50	3903.20	1548765	20
21	2026-03-28 09:32:45.560289+05:30	1209.50	1213.50	1202.00	1205.20	9479301	21
22	2026-03-28 09:32:46.18999+05:30	2856.00	2878.70	2770.20	2779.80	3938937	22
23	2026-03-28 09:32:46.889643+05:30	8971.50	9004.00	8840.00	8901.00	326675	23
24	2026-03-28 09:32:47.512024+05:30	875.00	875.15	841.25	843.80	11282824	24
25	2026-03-28 09:32:48.431226+05:30	1738.60	1738.60	1680.10	1694.70	2522237	25
26	2026-03-28 09:32:49.420325+05:30	9464.00	9531.00	9120.00	9150.00	131105	26
27	2026-03-28 09:32:49.968427+05:30	79.00	79.00	75.00	75.85	37587290	27
28	2026-03-28 09:32:50.650432+05:30	269.50	269.50	258.35	260.30	19957366	28
29	2026-03-28 09:32:51.325575+05:30	148.52	148.52	143.05	144.99	14692046	29
30	2026-03-28 09:32:51.880259+05:30	1190.00	1204.00	1131.20	1136.90	4013357	30
31	2026-03-28 09:32:52.527708+05:30	411.90	413.45	403.25	404.75	21818224	31
32	2026-03-28 09:32:53.155662+05:30	1721.00	1739.00	1684.30	1725.10	2212093	32
33	2026-03-28 09:32:53.992322+05:30	260.30	261.45	254.45	254.85	6984305	33
34	2026-03-28 09:32:54.7181+05:30	290.00	298.50	280.80	282.70	29524543	34
35	2026-03-28 09:32:55.467441+05:30	1839.90	1856.90	1818.40	1843.90	24490425	35
36	2026-03-28 09:32:56.043984+05:30	1575.20	1582.50	1485.70	1504.20	649009	36
37	2026-03-28 09:32:56.676679+05:30	378.55	378.95	368.20	370.10	4192803	37
38	2026-03-28 09:32:57.539326+05:30	1739.00	1739.00	1668.10	1675.20	366704	38
39	2026-03-28 09:32:58.277348+05:30	30395.00	30480.00	29515.00	29615.00	31803	39
40	2026-03-28 09:32:58.977881+05:30	5600.00	5627.00	5483.00	5500.00	378825	40
41	2026-03-28 09:33:00.428046+05:30	687.70	688.80	666.00	667.95	3464175	41
42	2026-03-28 09:33:01.145905+05:30	134.80	134.85	129.73	130.45	44250226	42
43	2026-03-28 09:33:02.101492+05:30	1470.00	1470.00	1410.00	1416.30	3233197	43
44	2026-03-28 09:33:02.79889+05:30	1226.50	1249.20	1226.50	1242.30	2220695	44
45	2026-03-28 09:33:03.512871+05:30	446.00	448.50	441.05	445.05	17184280	45
46	2026-03-28 09:33:04.254955+05:30	1305.10	1312.00	1253.00	1256.80	1427301	46
47	2026-03-28 09:33:05.001623+05:30	1162.00	1180.30	1140.40	1144.70	3106962	47
48	2026-03-28 09:33:05.844426+05:30	1918.70	1918.70	1872.10	1877.20	492401	48
49	2026-03-28 09:33:07.025513+05:30	441.00	442.75	432.85	438.20	2067540	49
50	2026-03-28 09:33:07.684288+05:30	2010.90	2014.00	1915.20	1930.90	695498	50
51	2026-03-28 09:33:08.677459+05:30	4730.60	4734.00	4570.00	4631.50	4040019	51
52	2026-03-28 09:33:09.244497+05:30	527.00	530.75	520.00	523.00	7748625	52
53	2026-03-28 09:33:10.19896+05:30	430.00	430.00	418.50	419.60	1692776	53
54	2026-03-28 09:33:10.802682+05:30	6011.50	6060.00	5935.00	5997.50	540647	54
55	2026-03-28 09:33:11.2436+05:30	10301.00	10310.00	9999.00	10019.00	572310	55
56	2026-03-28 09:33:11.72034+05:30	1297.00	1302.90	1278.20	1281.70	2165113	56
57	2026-03-28 09:33:12.169291+05:30	6915.00	6916.50	6742.00	6811.50	533428	57
58	2026-03-28 09:33:12.63284+05:30	237.55	239.14	232.40	233.17	38767220	58
59	2026-03-28 09:33:13.091775+05:30	307.15	308.10	299.00	300.85	1704633	59
60	2026-03-28 09:33:13.494761+05:30	241.50	244.35	237.60	239.65	7596664	60
61	2026-03-28 09:33:14.013057+05:30	269.00	270.95	265.30	269.30	16383055	61
62	2026-03-28 09:33:14.415439+05:30	830.05	830.10	807.75	814.15	2274836	62
63	2026-03-28 09:33:15.131679+05:30	139.00	139.72	136.56	137.19	18663640	63
64	2026-03-28 09:33:15.536928+05:30	90.12	90.19	87.59	89.09	9727084	64
65	2026-03-28 09:33:16.153243+05:30	2168.50	2188.40	2146.60	2170.50	743776	65
66	2026-03-28 09:33:16.669198+05:30	2030.00	2030.00	1890.00	1901.20	2056923	66
67	2026-03-28 09:33:17.177553+05:30	1035.00	1036.00	1006.00	1008.70	2455222	67
68	2026-03-28 09:33:18.099126+05:30	1543.20	1548.00	1496.70	1505.20	1684671	68
69	2026-03-28 09:33:18.719228+05:30	2651.00	2655.00	2604.60	2628.20	2406056	69
70	2026-03-28 09:33:19.531845+05:30	1377.00	1407.40	1359.80	1364.40	8956139	70
71	2026-03-28 09:33:19.97628+05:30	2370.00	2380.60	2300.00	2313.90	5308340	71
72	2026-03-28 09:33:21.113743+05:30	773.20	774.90	754.55	756.20	65485199	72
73	2026-03-28 09:33:21.580291+05:30	605.00	612.45	600.00	610.20	4422345	73
74	2026-03-28 09:33:22.080158+05:30	1268.40	1274.90	1226.30	1231.60	5656981	74
75	2026-03-28 09:33:22.589846+05:30	5212.00	5244.00	5125.50	5143.00	535331	75
76	2026-03-28 09:33:23.065754+05:30	860.00	872.95	854.75	866.70	4104597	76
77	2026-03-28 09:33:23.705842+05:30	3665.00	3665.00	3576.10	3588.60	2286154	77
78	2026-03-28 09:33:24.551238+05:30	352.50	357.70	338.25	340.90	15593599	78
79	2026-03-28 09:33:25.308929+05:30	2123.30	2127.00	2069.50	2074.40	2789151	79
80	2026-03-28 09:33:25.93845+05:30	506.95	520.00	505.00	509.70	6322713	80
81	2026-03-28 09:33:26.728903+05:30	25500.00	25545.00	24500.00	24685.00	187461	81
82	2026-03-28 09:33:27.647966+05:30	174.51	176.73	167.70	168.06	7732577	82
83	2026-03-28 09:33:28.178477+05:30	1862.00	1863.20	1801.00	1816.70	1273173	83
84	2026-03-28 09:33:28.705187+05:30	1256.00	1260.90	1230.10	1233.80	23630905	84
85	2026-03-28 09:33:29.400256+05:30	1770.30	1774.20	1735.40	1747.00	5111040	85
86	2026-03-28 09:33:29.854369+05:30	62.99	63.04	61.44	61.87	57163040	86
87	2026-03-28 09:33:30.491379+05:30	20.57	20.98	20.03	20.47	59486840	87
88	2026-03-28 09:33:31.022941+05:30	148.50	148.90	140.00	141.77	8685272	88
89	2026-03-28 09:33:31.735445+05:30	294.70	296.85	291.55	294.70	22179022	89
90	2026-03-28 09:33:32.335275+05:30	902.00	904.55	867.00	871.75	1988298	90
91	2026-03-28 09:33:32.938099+05:30	611.00	615.00	588.90	590.90	7459494	91
92	2026-03-28 09:33:33.479526+05:30	142.99	144.37	137.35	137.76	29985724	92
93	2026-03-28 09:33:34.056486+05:30	521.75	521.75	509.00	510.60	1982969	93
94	2026-03-28 09:33:34.767978+05:30	94.81	94.89	91.91	92.45	20674836	94
95	2026-03-28 09:33:35.469556+05:30	119.00	119.00	114.01	114.31	13334864	95
96	2026-03-28 09:33:36.12232+05:30	149.32	150.30	146.60	148.33	12266021	96
97	2026-03-28 09:33:36.837106+05:30	423.60	429.50	419.25	426.30	6160559	97
98	2026-03-28 09:33:37.487425+05:30	809.00	816.20	785.30	792.55	6211886	98
99	2026-03-28 09:33:39.161756+05:30	989.00	1012.50	983.00	991.40	10369509	99
100	2026-03-28 09:33:40.370304+05:30	1285.20	1294.80	1263.20	1269.70	13092541	100
101	2026-03-28 09:33:41.930249+05:30	4251.00	4251.00	4091.60	4099.50	1693708	101
102	2026-03-28 09:33:42.919252+05:30	491.80	498.00	480.00	484.80	14867532	102
103	2026-03-28 09:33:43.947135+05:30	1150.00	1150.80	1126.90	1130.30	2750813	103
104	2026-03-28 09:33:44.797745+05:30	1135.90	1154.70	1122.40	1131.40	1840045	104
105	2026-03-28 09:33:45.576909+05:30	236.00	236.50	231.55	232.55	19784230	105
106	2026-03-28 09:33:46.459287+05:30	462.00	464.50	448.50	454.35	2740257	106
107	2026-03-28 09:33:47.509476+05:30	4196.00	4230.50	4101.50	4124.00	598658	107
108	2026-03-28 09:33:48.475362+05:30	673.60	682.00	658.00	660.05	1598377	108
109	2026-03-28 09:33:49.424163+05:30	387.95	396.00	383.10	388.35	4605634	109
110	2026-03-28 09:33:50.616826+05:30	367.55	368.85	362.50	366.15	28928069	110
111	2026-03-28 09:33:51.582482+05:30	260.50	260.50	249.60	251.65	7078996	111
112	2026-03-28 09:33:52.618083+05:30	500.00	512.00	498.30	506.05	5161239	112
113	2026-03-28 09:33:53.709879+05:30	4272.00	4310.30	4182.10	4200.70	432608	113
114	2026-03-28 09:33:54.942349+05:30	3640.00	3640.00	3547.00	3564.10	3991388	114
115	2026-03-28 09:33:56.174993+05:30	775.00	775.00	760.10	765.65	5677064	115
116	2026-03-28 09:33:57.205565+05:30	725.00	729.65	691.85	700.20	5401882	116
117	2026-03-28 09:33:58.318519+05:30	2347.60	2369.30	2323.40	2334.80	951114	117
118	2026-03-28 09:33:59.567041+05:30	129400.00	130490.00	127525.00	129575.00	9722	118
119	2026-03-28 09:34:00.622999+05:30	315.80	316.45	300.90	301.95	1168609	119
120	2026-03-28 09:34:01.630101+05:30	3100.00	3105.20	3030.00	3041.30	3155168	120
121	2026-03-28 09:34:02.436728+05:30	2038.00	2052.60	2020.30	2038.80	542413	121
122	2026-03-28 09:34:03.341484+05:30	744.00	752.75	739.60	742.45	2099063	122
123	2026-03-28 09:34:04.136476+05:30	12626.00	12646.00	12342.00	12389.00	775339	123
124	2026-03-28 09:34:04.819702+05:30	1560.20	1574.00	1541.10	1557.10	832203	124
125	2026-03-28 09:34:05.639921+05:30	978.10	990.80	970.80	975.10	2557821	125
126	2026-03-28 09:34:06.615412+05:30	2255.90	2256.00	2156.00	2162.90	1958538	126
127	2026-03-28 09:34:07.770229+05:30	679.85	679.85	665.00	668.65	1002796	127
128	2026-03-28 09:34:08.80769+05:30	2115.00	2147.90	2097.10	2117.00	648475	128
129	2026-03-28 09:34:09.675942+05:30	3284.10	3348.70	3198.80	3270.60	4509352	129
130	2026-03-28 09:34:10.468817+05:30	77.20	78.28	76.34	76.59	15856853	130
131	2026-03-28 09:34:11.358935+05:30	77.59	78.29	76.55	77.20	25794674	131
132	2026-03-28 09:34:12.13889+05:30	96.00	96.00	94.30	95.06	6852822	132
133	2026-03-28 09:34:13.224201+05:30	379.90	379.90	374.65	375.65	20263654	133
134	2026-03-28 09:34:13.933297+05:30	364.50	375.00	362.00	371.00	15922058	134
135	2026-03-28 09:34:14.870293+05:30	1204.10	1215.70	1188.30	1193.20	2005121	135
136	2026-03-28 09:34:16.146124+05:30	1478.00	1488.30	1451.00	1457.00	1265278	136
137	2026-03-28 09:34:17.043755+05:30	270.50	285.00	269.70	281.95	60048871	137
138	2026-03-28 09:34:18.068427+05:30	473.70	490.00	462.05	478.00	9323712	138
139	2026-03-28 09:34:18.803068+05:30	1059.00	1059.00	1005.00	1008.80	2219237	139
140	2026-03-28 09:34:19.519912+05:30	6800.00	7062.00	6800.00	6947.00	980855	140
141	2026-03-28 09:34:20.328571+05:30	1464.80	1473.90	1393.30	1459.20	3003383	141
142	2026-03-28 09:34:21.060976+05:30	2865.00	2897.00	2800.00	2810.80	390243	142
143	2026-03-28 09:34:21.91757+05:30	32400.00	32425.00	31595.00	31805.00	35185	143
144	2026-03-28 09:34:23.380506+05:30	484.95	485.00	472.00	476.45	1655613	144
145	2026-03-28 09:34:24.503276+05:30	4880.00	4987.40	4851.10	4899.80	872749	145
146	2026-03-28 09:34:25.232145+05:30	1540.00	1559.90	1493.00	1501.40	884732	146
147	2026-03-28 09:34:25.971505+05:30	1351.70	1359.00	1310.00	1314.90	1353886	147
148	2026-03-28 09:34:26.588758+05:30	7046.00	7109.50	6935.00	7067.00	580456	148
149	2026-03-28 09:34:27.369754+05:30	402.00	403.95	394.75	396.00	9033117	149
150	2026-03-28 09:34:27.972053+05:30	294.45	297.30	290.30	295.50	27444747	150
151	2026-03-28 09:34:28.71957+05:30	905.20	920.65	889.25	893.80	2400261	151
152	2026-03-28 09:34:29.327443+05:30	1224.00	1227.00	1167.80	1172.80	1244993	152
153	2026-03-28 09:34:29.93612+05:30	109.12	109.12	104.60	105.13	35661197	153
154	2026-03-28 09:34:30.532052+05:30	326.00	326.00	317.55	318.45	8875060	154
155	2026-03-28 09:34:31.163675+05:30	266.30	268.20	261.60	264.05	8339136	155
156	2026-03-28 09:34:32.098112+05:30	1401.00	1404.70	1345.00	1348.10	23266517	156
157	2026-03-28 09:34:32.690098+05:30	698.00	698.05	671.10	673.95	4213936	157
158	2026-03-28 09:34:33.883127+05:30	1835.20	1851.10	1828.90	1837.60	1156884	158
159	2026-03-28 09:34:35.674728+05:30	2564.00	2564.00	2481.60	2494.90	599547	159
160	2026-03-28 09:34:36.391136+05:30	112.50	112.50	109.20	109.38	24039957	160
161	2026-03-28 09:34:36.91445+05:30	24220.00	24220.00	23565.00	23705.00	52525	161
162	2026-03-28 09:34:37.585592+05:30	950.00	951.00	900.00	903.80	12238678	162
163	2026-03-28 09:34:38.258878+05:30	2749.10	2749.10	2596.00	2629.40	559312	163
164	2026-03-28 09:34:38.825297+05:30	3096.00	3105.00	3010.00	3048.90	499098	164
165	2026-03-28 09:34:39.493619+05:30	12890.00	12890.00	12300.00	12418.00	270016	165
166	2026-03-28 09:34:40.069721+05:30	506.00	508.85	485.85	488.75	8344260	166
167	2026-03-28 09:34:40.782622+05:30	1051.30	1055.30	1013.00	1019.50	20445349	167
168	2026-03-28 09:34:41.326958+05:30	150.10	152.07	145.90	146.47	27097799	168
169	2026-03-28 09:34:42.117992+05:30	1785.00	1819.00	1785.00	1793.60	2975423	169
170	2026-03-28 09:34:42.658993+05:30	3804.60	3855.40	3727.50	3747.70	347157	170
171	2026-03-28 09:34:43.151087+05:30	41.85	42.05	40.60	40.82	73603173	171
172	2026-03-28 09:34:43.648281+05:30	276.00	278.00	266.30	268.55	14361653	172
173	2026-03-28 09:34:44.125477+05:30	3521.00	3521.00	3437.00	3445.20	950570	173
174	2026-03-28 09:34:44.650647+05:30	1449.80	1449.80	1385.00	1398.30	287286	174
175	2026-03-28 09:34:45.188832+05:30	2403.90	2422.10	2385.00	2389.80	4979411	175
176	2026-03-28 09:34:45.778576+05:30	1049.30	1057.50	1032.70	1048.50	1815831	176
177	2026-03-28 09:34:46.430883+05:30	4190.10	4264.60	4140.00	4160.80	325398	177
178	2026-03-28 09:34:47.047767+05:30	312.50	312.85	301.05	303.20	19009630	178
179	2026-03-28 09:34:47.642019+05:30	390.00	391.55	384.60	385.70	9994317	179
180	2026-03-28 09:34:48.260748+05:30	194.32	195.50	192.64	193.22	36938046	180
181	2026-03-28 09:34:48.808003+05:30	543.35	552.45	531.65	539.35	3383694	181
182	2026-03-28 09:34:49.390711+05:30	1395.00	1421.00	1385.50	1391.60	2584016	182
183	2026-03-28 09:34:49.942101+05:30	4000.00	4032.80	3972.00	3981.50	1040658	183
184	2026-03-28 09:34:51.200488+05:30	4300.00	4332.80	4252.80	4265.60	564869	184
185	2026-03-28 09:34:52.25664+05:30	1394.00	1394.00	1343.70	1352.30	1300657	185
186	2026-03-28 09:34:52.937073+05:30	3451.00	3505.90	3373.60	3399.60	1288297	186
187	2026-03-28 09:34:53.524829+05:30	2647.20	2674.60	2551.00	2566.30	213579	187
188	2026-03-28 09:34:54.204928+05:30	616.50	630.90	593.25	595.85	4252300	188
189	2026-03-28 09:34:54.824022+05:30	11174.00	11174.00	10970.00	11049.00	418469	189
190	2026-03-28 09:34:58.207661+05:30	178.72	178.90	172.55	175.48	87447033	190
191	2026-03-28 09:34:58.704279+05:30	1314.50	1314.60	1250.60	1253.80	1426042	191
192	2026-03-28 09:34:59.38695+05:30	400.00	400.90	388.00	389.30	8968617	192
193	2026-03-28 09:35:00.048953+05:30	655.45	666.70	648.05	649.40	17226044	193
194	2026-03-28 09:35:01.295077+05:30	106.22	108.14	105.60	106.37	9778614	194
195	2026-03-28 09:35:01.796705+05:30	9.00	9.06	8.84	8.89	467368070	195
196	2026-03-28 09:35:02.499209+05:30	1350.00	1359.00	1317.90	1322.60	1254069	196
197	2026-03-28 09:35:03.211702+05:30	3170.00	3183.40	3080.00	3092.60	1217830	197
198	2026-03-28 09:35:03.969089+05:30	189.05	192.29	187.90	191.60	26269256	198
199	2026-03-28 09:35:04.890823+05:30	18.47	18.47	17.96	18.12	234486177	199
200	2026-03-28 09:35:05.418046+05:30	901.95	910.40	894.00	896.70	940085	200
201	2026-03-28 10:44:46.900315+05:30	68807.08	68955.53	65548.25	66243.12	27766	211
202	2026-03-28 10:44:46.926206+05:30	2062.64	2072.36	1970.93	1989.73	379424	212
203	2026-03-28 10:44:46.929954+05:30	629.44	630.02	605.86	610.99	129781	213
204	2026-03-28 10:44:46.940877+05:30	86.55	86.75	81.86	82.46	2734547	214
205	2026-03-28 10:44:46.950433+05:30	1.37	1.37	1.32	1.33	110383100	215
206	2026-03-28 10:44:46.962159+05:30	0.26	0.26	0.24	0.24	145306481	216
207	2026-03-28 10:44:46.972601+05:30	0.09	0.09	0.09	0.09	520028666	217
208	2026-03-28 10:44:46.983499+05:30	1.32	1.33	1.27	1.29	6116962	218
209	2026-03-28 10:44:46.992965+05:30	0.38	0.38	0.38	0.38	2834467	219
210	2026-03-28 10:44:47.001149+05:30	55.14	55.18	53.26	53.62	259278	220
211	2026-03-30 02:24:04.559385+05:30	248.80	248.80	248.80	248.80	47842500	201
212	2026-03-30 02:24:04.811327+05:30	199.34	199.34	199.34	199.34	55855900	204
213	2026-03-30 02:24:05.017311+05:30	274.34	274.34	274.34	274.34	35815200	203
214	2026-03-30 02:24:05.281305+05:30	240.45	240.45	240.45	240.45	7617100	209
215	2026-03-30 02:24:05.515199+05:30	282.84	282.84	282.84	282.84	9869500	208
216	2026-03-30 02:24:05.767075+05:30	525.72	525.72	525.72	525.72	29980300	205
217	2026-03-30 02:24:06.034717+05:30	356.77	356.77	356.77	356.77	37763600	202
218	2026-03-30 02:24:06.242208+05:30	167.52	167.52	167.52	167.52	195294300	207
219	2026-03-30 02:24:06.485825+05:30	361.83	361.83	361.83	361.83	61869200	206
220	2026-03-30 02:24:06.698139+05:30	295.52	295.52	295.52	295.52	9971900	210
\.


--
-- Data for Name: token_blacklist_blacklistedtoken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.token_blacklist_blacklistedtoken (id, blacklisted_at, token_id) FROM stdin;
\.


--
-- Data for Name: token_blacklist_outstandingtoken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.token_blacklist_outstandingtoken (id, token, created_at, expires_at, user_id, jti) FROM stdin;
1	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDg2NTk3MiwiaWF0IjoxNzc0MjYxMTcyLCJqdGkiOiJhMDljNWZiNWUyNGU0YzA3OWUzZTQwZWUwMjQzYzEzMSIsInVzZXJfaWQiOjF9.Rr53XNVA3JdX0UZTg92tiSAagFzJdRcSLBWubzetvck	2026-03-23 15:49:32.267208+05:30	2026-03-30 15:49:32+05:30	1	a09c5fb5e24e4c079e3e40ee0243c131
2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDg2NjkzNCwiaWF0IjoxNzc0MjYyMTM0LCJqdGkiOiIzNzA4ZjdmZTBkNjE0YTUxYTJiYjM3ZDUxZjZhNmJlOCIsInVzZXJfaWQiOjF9.pD1xecZ3SLNWL2UmBnDgbBAE93E6scqGKalUqvniyZg	2026-03-23 16:05:34.652367+05:30	2026-03-30 16:05:34+05:30	1	3708f7fe0d614a51a2bb37d51f6a6be8
3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDg2ODU5OCwiaWF0IjoxNzc0MjYzNzk4LCJqdGkiOiJmZDI0YWVmMDg3NWI0NTJiYjEyOGRjYzAyYmY1ZGE0OCIsInVzZXJfaWQiOjF9.SPJOu8LzrBkbr5-ZwOdR61wbRxQ4Y-txFtKiedNmnrc	2026-03-23 16:33:18.491673+05:30	2026-03-30 16:33:18+05:30	1	fd24aef0875b452bb128dcc02bf5da48
4	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDg3MDA4MywiaWF0IjoxNzc0MjY1MjgzLCJqdGkiOiI5OTkwOTQ3OTNjM2E0MzFhYjBkMmRjMjkxZDljOTFkNiIsInVzZXJfaWQiOjF9.l-3K2U9oiOUcYSwc_0MfKunyTEeAEhzrY8W2t5pGwbY	2026-03-23 16:58:03.272803+05:30	2026-03-30 16:58:03+05:30	1	999094793c3a431ab0d2dc291d9c91d6
5	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDkzNDYyOSwiaWF0IjoxNzc0MzI5ODI5LCJqdGkiOiI0MGRiOWU4OGY4YjU0NWU2YTk0NDJlZTc1YmFlYzc5YiIsInVzZXJfaWQiOjF9.MqcCnMUQ4BqenJG4MAMdQV82D54z1SQRG2AvZX1KLfY	2026-03-24 10:53:49.474441+05:30	2026-03-31 10:53:49+05:30	1	40db9e88f8b545e6a9442ee75baec79b
6	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDkzNTc4MCwiaWF0IjoxNzc0MzMwOTgwLCJqdGkiOiJlNGM5YWU5MGU2ZTk0N2M5OGVkNzUxNjkyZDIxYWIzNiIsInVzZXJfaWQiOjF9.qb1ki5Ik15PDrIp3rfnqd0daITNwEj8XM8jEXNLmJPM	2026-03-24 11:13:00.105315+05:30	2026-03-31 11:13:00+05:30	1	e4c9ae90e6e947c98ed751692d21ab36
7	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NDkzOTQzMywiaWF0IjoxNzc0MzM0NjMzLCJqdGkiOiJlNmYxZjNhZmMzN2M0YWEzYjQxNTYxODYwNzM3OTI1MyIsInVzZXJfaWQiOjF9.YiUq5OWRrWla7itvP5T_jeZWSkvrBkxLh-kDlTRQfpQ	2026-03-24 12:13:53.84927+05:30	2026-03-31 12:13:53+05:30	1	e6f1f3afc37c4aa3b415618607379253
8	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTA0Mjc2MywiaWF0IjoxNzc0NDM3OTYzLCJqdGkiOiI5Y2ZlMDAwZmZmYzc0OGUxOWFmYjZkNTMyOWEzMzBjOSIsInVzZXJfaWQiOjF9.vHg9Y7dX6eJsUxRqcR19un9wcSHNTKmFVHjxxoYGMzQ	2026-03-25 16:56:03.112269+05:30	2026-04-01 16:56:03+05:30	1	9cfe000fffc748e19afb6d5329a330c9
9	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTExNjA3MSwiaWF0IjoxNzc0NTExMjcxLCJqdGkiOiIxNmViYTgzOTE2YjE0NWUxYmEyYjc1OWQxM2YyZmIzYyIsInVzZXJfaWQiOjF9.opJ2dEtZQ3yqX4iMzMo8OihsHph2G_dgocRY73hz_Tw	2026-03-26 13:17:51.633258+05:30	2026-04-02 13:17:51+05:30	1	16eba83916b145e1ba2b759d13f2fb3c
10	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTExNjE1MSwiaWF0IjoxNzc0NTExMzUxLCJqdGkiOiIyNzRjOWM3ODkxNGY0YWQwOTJkNTgwOTAwMmY4NjhhNyIsInVzZXJfaWQiOjF9.tMo8N9rE6I-RtO3q96tLu9ker1-EmHlEdQ1Je4t4QUA	2026-03-26 13:19:11.662442+05:30	2026-04-02 13:19:11+05:30	1	274c9c78914f4ad092d5809002f868a7
11	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTEyNjc3NywiaWF0IjoxNzc0NTIxOTc3LCJqdGkiOiI5NjhkZDgxYjQ2ODI0MWZkODA5YWIzN2FkMTIyYzQxNSIsInVzZXJfaWQiOjJ9.oE2p39Dh-qfw4lbY0gk8f_sJmUPxRjc9xdajVGA9rRM	2026-03-26 16:16:17.905676+05:30	2026-04-02 16:16:17+05:30	2	968dd81b468241fd809ab37ad122c415
12	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTEyNjkwMiwiaWF0IjoxNzc0NTIyMTAyLCJqdGkiOiJkYjgwYTljMmRlMGE0OGYwOTBjYWNkZTE3M2I0NjlmNCIsInVzZXJfaWQiOjJ9.uZuVl-Omigg9udc22ZYBR8vUH74dxo0QcpPkHRGo86w	2026-03-26 16:18:22.022971+05:30	2026-04-02 16:18:22+05:30	2	db80a9c2de0a48f090cacde173b469f4
13	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTE1MjgzNCwiaWF0IjoxNzc0NTQ4MDM0LCJqdGkiOiIwYTA5ZGQzNTQ0MmE0ZjZhYWYxMWJhNzQ4YmNmYjFmNSIsInVzZXJfaWQiOjF9.l-QgSdYxjyEKcIQRD5EI_rhNPxU0DoG2VI2c2lCf1Ow	2026-03-26 23:30:34.595821+05:30	2026-04-02 23:30:34+05:30	1	0a09dd35442a4f6aaf11ba748bcfb1f5
14	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTI3NTcyMywiaWF0IjoxNzc0NjcwOTIzLCJqdGkiOiI1OTQ0MDkyZWYzOWE0ZWNjODdhZjYxNmVkZWM4OGNjMSIsInVzZXJfaWQiOjF9.Y5p0AKTSoylbMuR4MJZBa8ddDHigBpRWPvnLrb4Y_8k	2026-03-28 09:38:43.940636+05:30	2026-04-04 09:38:43+05:30	1	5944092ef39a4ecc87af616edec88cc1
15	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTI3Njg0OCwiaWF0IjoxNzc0NjcyMDQ4LCJqdGkiOiI0MzJlMmFlZmYzZTg0NDQzYjQ1ZDc4MGE3MjVjZDM4NiIsInVzZXJfaWQiOjF9.y_Y1B3JdOOPCpM-mOkIBpV6pashejVOp6rNEx8pKgEc	2026-03-28 09:57:28.001879+05:30	2026-04-04 09:57:28+05:30	1	432e2aeff3e84443b45d780a725cd386
16	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTI4NTcwOSwiaWF0IjoxNzc0NjgwOTA5LCJqdGkiOiJmM2JjYzQ2NWJjNzI0MTk0YWQ5OWRhY2IzNDE2NTlkMCIsInVzZXJfaWQiOjF9.d7MTMYkzS4NGvzxP4w_9o9k94g3SuhXrUjxfTZZnHo8	2026-03-28 12:25:09.725318+05:30	2026-04-04 12:25:09+05:30	1	f3bcc465bc724194ad99dacb341659d0
17	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTM5MjMyMywiaWF0IjoxNzc0Nzg3NTIzLCJqdGkiOiJlODc1YTc3MDY4NGE0MDU5YjYyMDVkOTFhZjg5NjA2NSIsInVzZXJfaWQiOjE3fQ.1iXEMSN-D5ScWCRaBkn85_sZ1_13tVXr8XGU-DvC7GQ	2026-03-29 18:02:03.953192+05:30	2026-04-05 18:02:03+05:30	17	e875a770684a4059b6205d91af896065
18	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTM5Mjc1NSwiaWF0IjoxNzc0Nzg3OTU1LCJqdGkiOiI3MGNlMGEwMDJiMGY0MjI3YjA3YWNlNGYwMGZlZWExZCIsInVzZXJfaWQiOjE4fQ.MLHN50xfC7QZqjsWlCXfM1HDlCGWRV37odX-2hlDj84	2026-03-29 18:09:15.223707+05:30	2026-04-05 18:09:15+05:30	18	70ce0a002b0f4227b07ace4f00feea1d
19	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTM5Mjc4MCwiaWF0IjoxNzc0Nzg3OTgwLCJqdGkiOiJkN2Y2YjBlZGEzNWM0MTRlOTlmNjZjNDQ1MGM4MGVhNSIsInVzZXJfaWQiOjE4fQ.GA-F3e0NGNUUeE-RG-xvVsa0c-mIrHgWqEvcOmzgksQ	2026-03-29 18:09:40.67341+05:30	2026-04-05 18:09:40+05:30	18	d7f6b0eda35c414e99f66c4450c80ea5
20	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTM5NTcyOSwiaWF0IjoxNzc0NzkwOTI5LCJqdGkiOiJmYjU4ZDBlODhkN2E0NWU1OTVlNDZiMjlmMWE4OTllNiIsInVzZXJfaWQiOjE4fQ.pxzlAzhuk4Akifmq_w8y6MGL8coeCy1DPQ0oQtGfX5M	2026-03-29 18:58:49.143705+05:30	2026-04-05 18:58:49+05:30	18	fb58d0e88d7a45e595e46b29f1a899e6
21	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTM5Nzg3NywiaWF0IjoxNzc0NzkzMDc3LCJqdGkiOiIwMmE0OWZmZjU4YTk0NDI2YmZkODRiMjcyZTY2MWEyMCIsInVzZXJfaWQiOjF9.eK9jViqwdKJ1gxSohO9zer_t8t5UYnn4zDx7cSBphSs	2026-03-29 19:34:37.211126+05:30	2026-04-05 19:34:37+05:30	1	02a49fff58a94426bfd84b272e661a20
22	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTM5NzkyMSwiaWF0IjoxNzc0NzkzMTIxLCJqdGkiOiIzNjQzMDEyNDcwNzY0ZGRiOGExOTlhMThlZTU0Mzg3MiIsInVzZXJfaWQiOjE4fQ.8RDSJfpoNUTkkLWHaA5EiukiJNgSE3usfUkbsbrB7O8	2026-03-29 19:35:21.041411+05:30	2026-04-05 19:35:21+05:30	18	3643012470764ddb8a199a18ee543872
23	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQxMTg2NCwiaWF0IjoxNzc0ODA3MDY0LCJqdGkiOiI3ZDU0MzQ3YTJiYzI0ZjhiYWNjYjBhNTcwOGUxYzI2NSIsInVzZXJfaWQiOjE4fQ.JjGiEnMJFdqRj28BO9bneV8cUMokt3QWgrVM5U5Co_I	2026-03-29 23:27:44.722402+05:30	2026-04-05 23:27:44+05:30	18	7d54347a2bc24f8baccb0a5708e1c265
24	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQxNDQ4MSwiaWF0IjoxNzc0ODA5NjgxLCJqdGkiOiJhMzg3OGM4ZmYyZTM0Njk3OWNhYTBhZmJmMGZhZmIyOSIsInVzZXJfaWQiOjE4fQ.8cvt3ARbpoA1KvmhqfEoFxECAB-HrADra2UZ_AN1Q_c	2026-03-30 00:11:21.677379+05:30	2026-04-06 00:11:21+05:30	18	a3878c8ff2e346979caa0afbf0fafb29
25	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQxNTc0MiwiaWF0IjoxNzc0ODEwOTQyLCJqdGkiOiI5MDgyZGExMTE4YWI0NzgzYjJmNmU0ZjM0ZmRlNDVkMiIsInVzZXJfaWQiOjE4fQ.L9Ula0Wtr_Ly5v_vv_Vdjqhh59z1IQUCxgXUk5EN1GY	2026-03-30 00:32:22.399896+05:30	2026-04-06 00:32:22+05:30	18	9082da1118ab4783b2f6e4f34fde45d2
26	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQxNjQ2MCwiaWF0IjoxNzc0ODExNjYwLCJqdGkiOiIyYzZlMGFhY2VkOTg0YWJmYTg4MDhmODdhYzY0ZWUxNyIsInVzZXJfaWQiOiIxOCJ9.2hvb2hhVs3LQxCIiyqSjG-Z5woJDA4ki2PCw_zcVDKc	2026-03-30 00:44:20.389203+05:30	2026-04-06 00:44:20+05:30	18	2c6e0aaced984abfa8808f87ac64ee17
27	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQxNzQ0OCwiaWF0IjoxNzc0ODEyNjQ4LCJqdGkiOiJmNmMwYTk3ZDE2M2E0ZGExOWRkZWU0NmM1Y2VmMzE3NiIsInVzZXJfaWQiOiIxOCJ9.dYR7gMDcm_pdnz-XZPkFjn-rHOx-qtXZuMSXij2cqFk	2026-03-30 01:00:48.404806+05:30	2026-04-06 01:00:48+05:30	18	f6c0a97d163a4da19ddee46c5cef3176
28	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NTQxODI2NSwiaWF0IjoxNzc0ODEzNDY1LCJqdGkiOiI3Mzg3YzY3MjFjODY0MmU2ODk5YjM3MTJjYTcwNTg2ZCIsInVzZXJfaWQiOiIxOCJ9.o5MNUaYdCBt56_yE_NTrA7GGqOTTurYc4q_5TYBeryI	2026-03-30 01:14:25.633361+05:30	2026-04-06 01:14:25+05:30	18	7387c6721c8642e6899b3712ca70586d
29	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzQwNjcwOCwiaWF0IjoxNzc0ODE0NzA4LCJqdGkiOiJhMGE2ZTk5Y2I5MjI0ZGRmOWQ4ODQ3YmE0ZWJjYWRjMiIsInVzZXJfaWQiOiIxOCJ9.maMk8zVP7jME_0-9iUD4ORVL1ThhVyFhi8MoEUUqHkc	2026-03-30 01:35:08.35461+05:30	2026-04-29 01:35:08+05:30	18	a0a6e99cb9224ddf9d8847ba4ebcadc2
30	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc3NzQwODA4MSwiaWF0IjoxNzc0ODE2MDgxLCJqdGkiOiI5OTAyYzg5M2U5Mjg0MDc3YTQ4MDdlYjc5OTc0MjRjMyIsInVzZXJfaWQiOiIxOCJ9.XurZyd2un79FUma3DGeopabF8-UMEZd01yjFqegU-xs	2026-03-30 01:58:01.796233+05:30	2026-04-29 01:58:01+05:30	18	9902c893e9284077a4807eb7997424c3
\.


--
-- Data for Name: trading_transaction; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.trading_transaction (id, side, quantity, price, executed_at, portfolio_id, stock_id, user_id) FROM stdin;
\.


--
-- Name: account_emailaddress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.account_emailaddress_id_seq', 1, false);


--
-- Name: account_emailconfirmation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.account_emailconfirmation_id_seq', 1, false);


--
-- Name: accounts_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.accounts_user_groups_id_seq', 1, false);


--
-- Name: accounts_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.accounts_user_id_seq', 18, true);


--
-- Name: accounts_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.accounts_user_user_permissions_id_seq', 1, false);


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 112, true);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 28, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 65, true);


--
-- Name: django_site_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.django_site_id_seq', 1, true);


--
-- Name: insights_marketstocksnapshot_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.insights_marketstocksnapshot_id_seq', 1230, true);


--
-- Name: mlops_predictionrun_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mlops_predictionrun_id_seq', 1, false);


--
-- Name: mlops_stockcluster_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.mlops_stockcluster_id_seq', 3, true);


--
-- Name: otp_otp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.otp_otp_id_seq', 1, false);


--
-- Name: portfolio_holding_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.portfolio_holding_id_seq', 1, true);


--
-- Name: portfolio_portfolio_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.portfolio_portfolio_id_seq', 7, true);


--
-- Name: portfolio_portfoliostock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.portfolio_portfoliostock_id_seq', 3, true);


--
-- Name: socialaccount_socialaccount_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.socialaccount_socialaccount_id_seq', 1, false);


--
-- Name: socialaccount_socialapp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.socialaccount_socialapp_id_seq', 1, false);


--
-- Name: socialaccount_socialapp_sites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.socialaccount_socialapp_sites_id_seq', 1, false);


--
-- Name: socialaccount_socialtoken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.socialaccount_socialtoken_id_seq', 1, false);


--
-- Name: stocks_fundamental_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.stocks_fundamental_id_seq', 1, false);


--
-- Name: stocks_price_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.stocks_price_id_seq', 220, true);


--
-- Name: stocks_stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.stocks_stock_id_seq', 220, true);


--
-- Name: token_blacklist_blacklistedtoken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.token_blacklist_blacklistedtoken_id_seq', 1, false);


--
-- Name: token_blacklist_outstandingtoken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.token_blacklist_outstandingtoken_id_seq', 30, true);


--
-- Name: trading_transaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.trading_transaction_id_seq', 1, false);


--
-- Name: account_emailaddress account_emailaddress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_emailaddress
    ADD CONSTRAINT account_emailaddress_pkey PRIMARY KEY (id);


--
-- Name: account_emailaddress account_emailaddress_user_id_email_987c8728_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_emailaddress
    ADD CONSTRAINT account_emailaddress_user_id_email_987c8728_uniq UNIQUE (user_id, email);


--
-- Name: account_emailconfirmation account_emailconfirmation_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_emailconfirmation
    ADD CONSTRAINT account_emailconfirmation_key_key UNIQUE (key);


--
-- Name: account_emailconfirmation account_emailconfirmation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_emailconfirmation
    ADD CONSTRAINT account_emailconfirmation_pkey PRIMARY KEY (id);


--
-- Name: accounts_user accounts_user_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user
    ADD CONSTRAINT accounts_user_email_key UNIQUE (email);


--
-- Name: accounts_user accounts_user_google_sub_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user
    ADD CONSTRAINT accounts_user_google_sub_key UNIQUE (google_sub);


--
-- Name: accounts_user_groups accounts_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user_groups
    ADD CONSTRAINT accounts_user_groups_pkey PRIMARY KEY (id);


--
-- Name: accounts_user_groups accounts_user_groups_user_id_group_id_59c0b32f_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user_groups
    ADD CONSTRAINT accounts_user_groups_user_id_group_id_59c0b32f_uniq UNIQUE (user_id, group_id);


--
-- Name: accounts_user accounts_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user
    ADD CONSTRAINT accounts_user_pkey PRIMARY KEY (id);


--
-- Name: accounts_user_user_permissions accounts_user_user_permi_user_id_permission_id_2ab516c2_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user_user_permissions
    ADD CONSTRAINT accounts_user_user_permi_user_id_permission_id_2ab516c2_uniq UNIQUE (user_id, permission_id);


--
-- Name: accounts_user_user_permissions accounts_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user_user_permissions
    ADD CONSTRAINT accounts_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: accounts_user accounts_user_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user
    ADD CONSTRAINT accounts_user_username_key UNIQUE (username);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: django_site django_site_domain_a2e37b91_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_site
    ADD CONSTRAINT django_site_domain_a2e37b91_uniq UNIQUE (domain);


--
-- Name: django_site django_site_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_site
    ADD CONSTRAINT django_site_pkey PRIMARY KEY (id);


--
-- Name: insights_marketstocksnapshot insights_marketstocksnapshot_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insights_marketstocksnapshot
    ADD CONSTRAINT insights_marketstocksnapshot_pkey PRIMARY KEY (id);


--
-- Name: insights_marketstocksnapshot insights_marketstocksnapshot_symbol_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.insights_marketstocksnapshot
    ADD CONSTRAINT insights_marketstocksnapshot_symbol_key UNIQUE (symbol);


--
-- Name: mlops_predictionrun mlops_predictionrun_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mlops_predictionrun
    ADD CONSTRAINT mlops_predictionrun_pkey PRIMARY KEY (id);


--
-- Name: mlops_stockcluster mlops_stockcluster_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mlops_stockcluster
    ADD CONSTRAINT mlops_stockcluster_pkey PRIMARY KEY (id);


--
-- Name: mlops_stockcluster mlops_stockcluster_portfolio_id_stock_id_a4d6d1d7_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mlops_stockcluster
    ADD CONSTRAINT mlops_stockcluster_portfolio_id_stock_id_a4d6d1d7_uniq UNIQUE (portfolio_id, stock_id);


--
-- Name: otp_otp otp_otp_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otp_otp
    ADD CONSTRAINT otp_otp_pkey PRIMARY KEY (id);


--
-- Name: portfolio_holding portfolio_holding_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_holding
    ADD CONSTRAINT portfolio_holding_pkey PRIMARY KEY (id);


--
-- Name: portfolio_holding portfolio_holding_portfolio_id_stock_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_holding
    ADD CONSTRAINT portfolio_holding_portfolio_id_stock_id_key UNIQUE (portfolio_id, stock_id);


--
-- Name: portfolio_portfolio portfolio_portfolio_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_portfolio
    ADD CONSTRAINT portfolio_portfolio_pkey PRIMARY KEY (id);


--
-- Name: portfolio_portfoliostock portfolio_portfoliostock_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_portfoliostock
    ADD CONSTRAINT portfolio_portfoliostock_pkey PRIMARY KEY (id);


--
-- Name: portfolio_portfoliostock portfolio_portfoliostock_portfolio_id_stock_id_2162e702_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_portfoliostock
    ADD CONSTRAINT portfolio_portfoliostock_portfolio_id_stock_id_2162e702_uniq UNIQUE (portfolio_id, stock_id);


--
-- Name: socialaccount_socialaccount socialaccount_socialaccount_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.socialaccount_socialaccount
    ADD CONSTRAINT socialaccount_socialaccount_pkey PRIMARY KEY (id);


--
-- Name: socialaccount_socialaccount socialaccount_socialaccount_provider_uid_fc810c6e_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.socialaccount_socialaccount
    ADD CONSTRAINT socialaccount_socialaccount_provider_uid_fc810c6e_uniq UNIQUE (provider, uid);


--
-- Name: socialaccount_socialapp_sites socialaccount_socialapp__socialapp_id_site_id_71a9a768_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.socialaccount_socialapp_sites
    ADD CONSTRAINT socialaccount_socialapp__socialapp_id_site_id_71a9a768_uniq UNIQUE (socialapp_id, site_id);


--
-- Name: socialaccount_socialapp socialaccount_socialapp_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.socialaccount_socialapp
    ADD CONSTRAINT socialaccount_socialapp_pkey PRIMARY KEY (id);


--
-- Name: socialaccount_socialapp_sites socialaccount_socialapp_sites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.socialaccount_socialapp_sites
    ADD CONSTRAINT socialaccount_socialapp_sites_pkey PRIMARY KEY (id);


--
-- Name: socialaccount_socialtoken socialaccount_socialtoken_app_id_account_id_fca4e0ac_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.socialaccount_socialtoken
    ADD CONSTRAINT socialaccount_socialtoken_app_id_account_id_fca4e0ac_uniq UNIQUE (app_id, account_id);


--
-- Name: socialaccount_socialtoken socialaccount_socialtoken_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.socialaccount_socialtoken
    ADD CONSTRAINT socialaccount_socialtoken_pkey PRIMARY KEY (id);


--
-- Name: stocks_fundamental stocks_fundamental_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stocks_fundamental
    ADD CONSTRAINT stocks_fundamental_pkey PRIMARY KEY (id);


--
-- Name: stocks_fundamental stocks_fundamental_stock_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stocks_fundamental
    ADD CONSTRAINT stocks_fundamental_stock_id_key UNIQUE (stock_id);


--
-- Name: stocks_stockprice stocks_price_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stocks_stockprice
    ADD CONSTRAINT stocks_price_pkey PRIMARY KEY (id);


--
-- Name: stocks_stockprice stocks_price_stock_id_timestamp_00ab44b9_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stocks_stockprice
    ADD CONSTRAINT stocks_price_stock_id_timestamp_00ab44b9_uniq UNIQUE (stock_id, "timestamp");


--
-- Name: stocks_stockmaster stocks_stock_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stocks_stockmaster
    ADD CONSTRAINT stocks_stock_pkey PRIMARY KEY (id);


--
-- Name: stocks_stockmaster stocks_stock_symbol_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stocks_stockmaster
    ADD CONSTRAINT stocks_stock_symbol_key UNIQUE (symbol);


--
-- Name: token_blacklist_blacklistedtoken token_blacklist_blacklistedtoken_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_blacklistedtoken
    ADD CONSTRAINT token_blacklist_blacklistedtoken_pkey PRIMARY KEY (id);


--
-- Name: token_blacklist_blacklistedtoken token_blacklist_blacklistedtoken_token_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_blacklistedtoken
    ADD CONSTRAINT token_blacklist_blacklistedtoken_token_id_key UNIQUE (token_id);


--
-- Name: token_blacklist_outstandingtoken token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_outstandingtoken
    ADD CONSTRAINT token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq UNIQUE (jti);


--
-- Name: token_blacklist_outstandingtoken token_blacklist_outstandingtoken_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_outstandingtoken
    ADD CONSTRAINT token_blacklist_outstandingtoken_pkey PRIMARY KEY (id);


--
-- Name: trading_transaction trading_transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trading_transaction
    ADD CONSTRAINT trading_transaction_pkey PRIMARY KEY (id);


--
-- Name: account_emailaddress_email_03be32b2; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX account_emailaddress_email_03be32b2 ON public.account_emailaddress USING btree (email);


--
-- Name: account_emailaddress_email_03be32b2_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX account_emailaddress_email_03be32b2_like ON public.account_emailaddress USING btree (email varchar_pattern_ops);


--
-- Name: account_emailaddress_user_id_2c513194; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX account_emailaddress_user_id_2c513194 ON public.account_emailaddress USING btree (user_id);


--
-- Name: account_emailconfirmation_email_address_id_5b7f8c58; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX account_emailconfirmation_email_address_id_5b7f8c58 ON public.account_emailconfirmation USING btree (email_address_id);


--
-- Name: account_emailconfirmation_key_f43612bd_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX account_emailconfirmation_key_f43612bd_like ON public.account_emailconfirmation USING btree (key varchar_pattern_ops);


--
-- Name: accounts_user_email_b2644a56_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX accounts_user_email_b2644a56_like ON public.accounts_user USING btree (email varchar_pattern_ops);


--
-- Name: accounts_user_google_sub_8c9d6bcc_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX accounts_user_google_sub_8c9d6bcc_like ON public.accounts_user USING btree (google_sub varchar_pattern_ops);


--
-- Name: accounts_user_groups_group_id_bd11a704; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX accounts_user_groups_group_id_bd11a704 ON public.accounts_user_groups USING btree (group_id);


--
-- Name: accounts_user_groups_user_id_52b62117; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX accounts_user_groups_user_id_52b62117 ON public.accounts_user_groups USING btree (user_id);


--
-- Name: accounts_user_user_permissions_permission_id_113bb443; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX accounts_user_user_permissions_permission_id_113bb443 ON public.accounts_user_user_permissions USING btree (permission_id);


--
-- Name: accounts_user_user_permissions_user_id_e4f0a161; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX accounts_user_user_permissions_user_id_e4f0a161 ON public.accounts_user_user_permissions USING btree (user_id);


--
-- Name: accounts_user_username_6088629e_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX accounts_user_username_6088629e_like ON public.accounts_user USING btree (username varchar_pattern_ops);


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: django_site_domain_a2e37b91_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX django_site_domain_a2e37b91_like ON public.django_site USING btree (domain varchar_pattern_ops);


--
-- Name: insights_marketstocksnapshot_market_1df416e9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX insights_marketstocksnapshot_market_1df416e9 ON public.insights_marketstocksnapshot USING btree (market);


--
-- Name: insights_marketstocksnapshot_market_1df416e9_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX insights_marketstocksnapshot_market_1df416e9_like ON public.insights_marketstocksnapshot USING btree (market varchar_pattern_ops);


--
-- Name: insights_marketstocksnapshot_symbol_f017feda_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX insights_marketstocksnapshot_symbol_f017feda_like ON public.insights_marketstocksnapshot USING btree (symbol varchar_pattern_ops);


--
-- Name: mlops_predictionrun_created_by_id_270b3af6; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mlops_predictionrun_created_by_id_270b3af6 ON public.mlops_predictionrun USING btree (created_by_id);


--
-- Name: mlops_predictionrun_stock_id_5490ce83; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mlops_predictionrun_stock_id_5490ce83 ON public.mlops_predictionrun USING btree (stock_id);


--
-- Name: mlops_stockcluster_created_by_id_b7dccc66; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mlops_stockcluster_created_by_id_b7dccc66 ON public.mlops_stockcluster USING btree (created_by_id);


--
-- Name: mlops_stockcluster_portfolio_id_11ab9cc1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mlops_stockcluster_portfolio_id_11ab9cc1 ON public.mlops_stockcluster USING btree (portfolio_id);


--
-- Name: mlops_stockcluster_stock_id_cb23487b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX mlops_stockcluster_stock_id_cb23487b ON public.mlops_stockcluster USING btree (stock_id);


--
-- Name: otp_otp_user_id_fe9d6c52; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX otp_otp_user_id_fe9d6c52 ON public.otp_otp USING btree (user_id);


--
-- Name: portfolio_portfolio_user_id_91731826; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX portfolio_portfolio_user_id_91731826 ON public.portfolio_portfolio USING btree (user_id);


--
-- Name: portfolio_portfoliostock_portfolio_id_dcea0927; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX portfolio_portfoliostock_portfolio_id_dcea0927 ON public.portfolio_portfoliostock USING btree (portfolio_id);


--
-- Name: portfolio_portfoliostock_stock_id_d5b91619; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX portfolio_portfoliostock_stock_id_d5b91619 ON public.portfolio_portfoliostock USING btree (stock_id);


--
-- Name: socialaccount_socialaccount_user_id_8146e70c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX socialaccount_socialaccount_user_id_8146e70c ON public.socialaccount_socialaccount USING btree (user_id);


--
-- Name: socialaccount_socialapp_sites_site_id_2579dee5; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX socialaccount_socialapp_sites_site_id_2579dee5 ON public.socialaccount_socialapp_sites USING btree (site_id);


--
-- Name: socialaccount_socialapp_sites_socialapp_id_97fb6e7d; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX socialaccount_socialapp_sites_socialapp_id_97fb6e7d ON public.socialaccount_socialapp_sites USING btree (socialapp_id);


--
-- Name: socialaccount_socialtoken_account_id_951f210e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX socialaccount_socialtoken_account_id_951f210e ON public.socialaccount_socialtoken USING btree (account_id);


--
-- Name: socialaccount_socialtoken_app_id_636a42d7; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX socialaccount_socialtoken_app_id_636a42d7 ON public.socialaccount_socialtoken USING btree (app_id);


--
-- Name: stocks_price_stock_id_0ec3929e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stocks_price_stock_id_0ec3929e ON public.stocks_stockprice USING btree (stock_id);


--
-- Name: stocks_price_timestamp_817d435e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stocks_price_timestamp_817d435e ON public.stocks_stockprice USING btree ("timestamp");


--
-- Name: stocks_stock_symbol_e2aab713_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX stocks_stock_symbol_e2aab713_like ON public.stocks_stockmaster USING btree (symbol varchar_pattern_ops);


--
-- Name: token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like ON public.token_blacklist_outstandingtoken USING btree (jti varchar_pattern_ops);


--
-- Name: token_blacklist_outstandingtoken_user_id_83bc629a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX token_blacklist_outstandingtoken_user_id_83bc629a ON public.token_blacklist_outstandingtoken USING btree (user_id);


--
-- Name: trading_transaction_portfolio_id_f6bdebbd; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX trading_transaction_portfolio_id_f6bdebbd ON public.trading_transaction USING btree (portfolio_id);


--
-- Name: trading_transaction_stock_id_f24f78e6; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX trading_transaction_stock_id_f24f78e6 ON public.trading_transaction USING btree (stock_id);


--
-- Name: trading_transaction_user_id_c7611efd; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX trading_transaction_user_id_c7611efd ON public.trading_transaction USING btree (user_id);


--
-- Name: unique_primary_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_primary_email ON public.account_emailaddress USING btree (user_id, "primary") WHERE "primary";


--
-- Name: unique_user_portfolio_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_user_portfolio_name ON public.portfolio_portfolio USING btree (user_id, name) WHERE (user_id IS NOT NULL);


--
-- Name: unique_verified_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX unique_verified_email ON public.account_emailaddress USING btree (email) WHERE verified;


--
-- Name: account_emailaddress account_emailaddress_user_id_2c513194_fk_accounts_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_emailaddress
    ADD CONSTRAINT account_emailaddress_user_id_2c513194_fk_accounts_user_id FOREIGN KEY (user_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_emailconfirmation account_emailconfirm_email_address_id_5b7f8c58_fk_account_e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_emailconfirmation
    ADD CONSTRAINT account_emailconfirm_email_address_id_5b7f8c58_fk_account_e FOREIGN KEY (email_address_id) REFERENCES public.account_emailaddress(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: accounts_user_groups accounts_user_groups_group_id_bd11a704_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user_groups
    ADD CONSTRAINT accounts_user_groups_group_id_bd11a704_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: accounts_user_groups accounts_user_groups_user_id_52b62117_fk_accounts_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user_groups
    ADD CONSTRAINT accounts_user_groups_user_id_52b62117_fk_accounts_user_id FOREIGN KEY (user_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: accounts_user_user_permissions accounts_user_user_p_permission_id_113bb443_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user_user_permissions
    ADD CONSTRAINT accounts_user_user_p_permission_id_113bb443_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: accounts_user_user_permissions accounts_user_user_p_user_id_e4f0a161_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_user_user_permissions
    ADD CONSTRAINT accounts_user_user_p_user_id_e4f0a161_fk_accounts_ FOREIGN KEY (user_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_accounts_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_accounts_user_id FOREIGN KEY (user_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: mlops_predictionrun mlops_predictionrun_created_by_id_270b3af6_fk_accounts_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mlops_predictionrun
    ADD CONSTRAINT mlops_predictionrun_created_by_id_270b3af6_fk_accounts_user_id FOREIGN KEY (created_by_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: mlops_predictionrun mlops_predictionrun_stock_id_5490ce83_fk_stocks_stock_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mlops_predictionrun
    ADD CONSTRAINT mlops_predictionrun_stock_id_5490ce83_fk_stocks_stock_id FOREIGN KEY (stock_id) REFERENCES public.stocks_stockmaster(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: mlops_stockcluster mlops_stockcluster_created_by_id_b7dccc66_fk_accounts_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mlops_stockcluster
    ADD CONSTRAINT mlops_stockcluster_created_by_id_b7dccc66_fk_accounts_user_id FOREIGN KEY (created_by_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: mlops_stockcluster mlops_stockcluster_portfolio_id_11ab9cc1_fk_portfolio; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mlops_stockcluster
    ADD CONSTRAINT mlops_stockcluster_portfolio_id_11ab9cc1_fk_portfolio FOREIGN KEY (portfolio_id) REFERENCES public.portfolio_portfolio(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: mlops_stockcluster mlops_stockcluster_stock_id_cb23487b_fk_stocks_stock_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mlops_stockcluster
    ADD CONSTRAINT mlops_stockcluster_stock_id_cb23487b_fk_stocks_stock_id FOREIGN KEY (stock_id) REFERENCES public.stocks_stockmaster(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: otp_otp otp_otp_user_id_fe9d6c52_fk_accounts_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otp_otp
    ADD CONSTRAINT otp_otp_user_id_fe9d6c52_fk_accounts_user_id FOREIGN KEY (user_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: portfolio_holding portfolio_holding_portfolio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_holding
    ADD CONSTRAINT portfolio_holding_portfolio_id_fkey FOREIGN KEY (portfolio_id) REFERENCES public.portfolio_portfolio(id) ON DELETE CASCADE;


--
-- Name: portfolio_holding portfolio_holding_stock_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_holding
    ADD CONSTRAINT portfolio_holding_stock_id_fkey FOREIGN KEY (stock_id) REFERENCES public.stocks_stockmaster(id) ON DELETE CASCADE;


--
-- Name: portfolio_portfolio portfolio_portfolio_user_id_91731826_fk_accounts_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_portfolio
    ADD CONSTRAINT portfolio_portfolio_user_id_91731826_fk_accounts_user_id FOREIGN KEY (user_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: portfolio_portfoliostock portfolio_portfolios_portfolio_id_dcea0927_fk_portfolio; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_portfoliostock
    ADD CONSTRAINT portfolio_portfolios_portfolio_id_dcea0927_fk_portfolio FOREIGN KEY (portfolio_id) REFERENCES public.portfolio_portfolio(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: portfolio_portfoliostock portfolio_portfoliostock_stock_id_d5b91619_fk_stocks_stock_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.portfolio_portfoliostock
    ADD CONSTRAINT portfolio_portfoliostock_stock_id_d5b91619_fk_stocks_stock_id FOREIGN KEY (stock_id) REFERENCES public.stocks_stockmaster(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: socialaccount_socialtoken socialaccount_social_account_id_951f210e_fk_socialacc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.socialaccount_socialtoken
    ADD CONSTRAINT socialaccount_social_account_id_951f210e_fk_socialacc FOREIGN KEY (account_id) REFERENCES public.socialaccount_socialaccount(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: socialaccount_socialtoken socialaccount_social_app_id_636a42d7_fk_socialacc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.socialaccount_socialtoken
    ADD CONSTRAINT socialaccount_social_app_id_636a42d7_fk_socialacc FOREIGN KEY (app_id) REFERENCES public.socialaccount_socialapp(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: socialaccount_socialapp_sites socialaccount_social_site_id_2579dee5_fk_django_si; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.socialaccount_socialapp_sites
    ADD CONSTRAINT socialaccount_social_site_id_2579dee5_fk_django_si FOREIGN KEY (site_id) REFERENCES public.django_site(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: socialaccount_socialapp_sites socialaccount_social_socialapp_id_97fb6e7d_fk_socialacc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.socialaccount_socialapp_sites
    ADD CONSTRAINT socialaccount_social_socialapp_id_97fb6e7d_fk_socialacc FOREIGN KEY (socialapp_id) REFERENCES public.socialaccount_socialapp(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: socialaccount_socialaccount socialaccount_social_user_id_8146e70c_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.socialaccount_socialaccount
    ADD CONSTRAINT socialaccount_social_user_id_8146e70c_fk_accounts_ FOREIGN KEY (user_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: stocks_fundamental stocks_fundamental_stock_id_e43c72e0_fk_stocks_stock_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stocks_fundamental
    ADD CONSTRAINT stocks_fundamental_stock_id_e43c72e0_fk_stocks_stock_id FOREIGN KEY (stock_id) REFERENCES public.stocks_stockmaster(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: stocks_stockprice stocks_price_stock_id_0ec3929e_fk_stocks_stock_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stocks_stockprice
    ADD CONSTRAINT stocks_price_stock_id_0ec3929e_fk_stocks_stock_id FOREIGN KEY (stock_id) REFERENCES public.stocks_stockmaster(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: token_blacklist_blacklistedtoken token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_blacklistedtoken
    ADD CONSTRAINT token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk FOREIGN KEY (token_id) REFERENCES public.token_blacklist_outstandingtoken(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: token_blacklist_outstandingtoken token_blacklist_outs_user_id_83bc629a_fk_accounts_; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_blacklist_outstandingtoken
    ADD CONSTRAINT token_blacklist_outs_user_id_83bc629a_fk_accounts_ FOREIGN KEY (user_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: trading_transaction trading_transaction_portfolio_id_f6bdebbd_fk_portfolio; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trading_transaction
    ADD CONSTRAINT trading_transaction_portfolio_id_f6bdebbd_fk_portfolio FOREIGN KEY (portfolio_id) REFERENCES public.portfolio_portfolio(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: trading_transaction trading_transaction_stock_id_f24f78e6_fk_stocks_stock_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trading_transaction
    ADD CONSTRAINT trading_transaction_stock_id_f24f78e6_fk_stocks_stock_id FOREIGN KEY (stock_id) REFERENCES public.stocks_stockmaster(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: trading_transaction trading_transaction_user_id_c7611efd_fk_accounts_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.trading_transaction
    ADD CONSTRAINT trading_transaction_user_id_c7611efd_fk_accounts_user_id FOREIGN KEY (user_id) REFERENCES public.accounts_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- PostgreSQL database dump complete
--

\unrestrict KhK9H9Pz0AvRo5BFUtqK5ZB3XMfKKGt2QQ7pOJVd6SiWoPTwrIKOXdBCpgibRMS

