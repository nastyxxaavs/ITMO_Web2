--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8 (Debian 16.8-1.pgdg120+1)
-- Dumped by pg_dump version 17.2

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: nastyxxaavs_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO nastyxxaavs_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: client_request_entity; Type: TABLE; Schema: public; Owner: nastyxxaavs_user
--

CREATE TABLE public.client_request_entity (
    id integer NOT NULL,
    "clientName" character varying NOT NULL,
    "contactInfo" character varying NOT NULL,
    "requestDate" timestamp without time zone NOT NULL,
    status character varying NOT NULL,
    "firmId" integer,
    "usersId" integer,
    "teamMemberId" integer,
    "serviceId" integer,
    "serviceRequested" integer,
    CONSTRAINT client_request_status_check CHECK (((status)::text = ANY ((ARRAY['В процессе'::character varying, 'Завершен'::character varying])::text[])))
);


ALTER TABLE public.client_request_entity OWNER TO nastyxxaavs_user;

--
-- Name: client_request_id_seq; Type: SEQUENCE; Schema: public; Owner: nastyxxaavs_user
--

CREATE SEQUENCE public.client_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.client_request_id_seq OWNER TO nastyxxaavs_user;

--
-- Name: client_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nastyxxaavs_user
--

ALTER SEQUENCE public.client_request_id_seq OWNED BY public.client_request_entity.id;


--
-- Name: contact; Type: TABLE; Schema: public; Owner: nastyxxaavs_user
--

CREATE TABLE public.contact (
    id integer NOT NULL,
    address character varying NOT NULL,
    phone character varying NOT NULL,
    email character varying NOT NULL,
    "mapsLink" character varying NOT NULL,
    "firmId" integer
);


ALTER TABLE public.contact OWNER TO nastyxxaavs_user;

--
-- Name: contact_id_seq; Type: SEQUENCE; Schema: public; Owner: nastyxxaavs_user
--

CREATE SEQUENCE public.contact_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_id_seq OWNER TO nastyxxaavs_user;

--
-- Name: contact_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nastyxxaavs_user
--

ALTER SEQUENCE public.contact_id_seq OWNED BY public.contact.id;


--
-- Name: firm; Type: TABLE; Schema: public; Owner: nastyxxaavs_user
--

CREATE TABLE public.firm (
    id integer NOT NULL,
    name character varying NOT NULL,
    description text NOT NULL
);


ALTER TABLE public.firm OWNER TO nastyxxaavs_user;

--
-- Name: firm_id_seq; Type: SEQUENCE; Schema: public; Owner: nastyxxaavs_user
--

CREATE SEQUENCE public.firm_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.firm_id_seq OWNER TO nastyxxaavs_user;

--
-- Name: firm_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nastyxxaavs_user
--

ALTER SEQUENCE public.firm_id_seq OWNED BY public.firm.id;


--
-- Name: submission; Type: TABLE; Schema: public; Owner: nastyxxaavs_user
--

CREATE TABLE public.submission (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    "createdAt" timestamp without time zone NOT NULL
);


ALTER TABLE public.submission OWNER TO nastyxxaavs_user;

--
-- Name: form_id_seq; Type: SEQUENCE; Schema: public; Owner: nastyxxaavs_user
--

CREATE SEQUENCE public.form_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.form_id_seq OWNER TO nastyxxaavs_user;

--
-- Name: form_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nastyxxaavs_user
--

ALTER SEQUENCE public.form_id_seq OWNED BY public.submission.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: nastyxxaavs_user
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO nastyxxaavs_user;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: nastyxxaavs_user
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO nastyxxaavs_user;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nastyxxaavs_user
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: service; Type: TABLE; Schema: public; Owner: nastyxxaavs_user
--

CREATE TABLE public.service (
    id integer NOT NULL,
    name character varying NOT NULL,
    description text NOT NULL,
    category character varying NOT NULL,
    price integer NOT NULL,
    "firmId" integer,
    CONSTRAINT service_category_check CHECK (((category)::text = ANY ((ARRAY['Арбитраж/третейские суды'::character varying, 'Споры с таможней'::character varying, 'Трудовые споры'::character varying, 'Контракты'::character varying, 'Локализация бизнеса'::character varying, 'Консультирование сельхозпроизводителей'::character varying])::text[])))
);


ALTER TABLE public.service OWNER TO nastyxxaavs_user;

--
-- Name: service_id_seq; Type: SEQUENCE; Schema: public; Owner: nastyxxaavs_user
--

CREATE SEQUENCE public.service_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.service_id_seq OWNER TO nastyxxaavs_user;

--
-- Name: service_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nastyxxaavs_user
--

ALTER SEQUENCE public.service_id_seq OWNED BY public.service.id;


--
-- Name: service_team_member; Type: TABLE; Schema: public; Owner: nastyxxaavs_user
--

CREATE TABLE public.service_team_member (
    "serviceId" integer NOT NULL,
    "teamMemberId" integer NOT NULL
);


ALTER TABLE public.service_team_member OWNER TO nastyxxaavs_user;

--
-- Name: service_user; Type: TABLE; Schema: public; Owner: nastyxxaavs_user
--

CREATE TABLE public.service_user (
    "serviceId" integer NOT NULL,
    "userId" integer NOT NULL
);


ALTER TABLE public.service_user OWNER TO nastyxxaavs_user;

--
-- Name: team_member; Type: TABLE; Schema: public; Owner: nastyxxaavs_user
--

CREATE TABLE public.team_member (
    id integer NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    "position" character varying NOT NULL,
    "firmId" integer,
    CONSTRAINT team_member_position_check CHECK ((("position")::text = ANY ((ARRAY['Начальник отдела'::character varying, 'Генеральный директор'::character varying, 'Руководитель практики'::character varying, 'Помощник юриста'::character varying, 'Главный бухгалтер'::character varying, 'Ведущий юрист'::character varying, 'Младший юрист'::character varying, 'HR'::character varying])::text[])))
);


ALTER TABLE public.team_member OWNER TO nastyxxaavs_user;

--
-- Name: team_member_id_seq; Type: SEQUENCE; Schema: public; Owner: nastyxxaavs_user
--

CREATE SEQUENCE public.team_member_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.team_member_id_seq OWNER TO nastyxxaavs_user;

--
-- Name: team_member_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nastyxxaavs_user
--

ALTER SEQUENCE public.team_member_id_seq OWNED BY public.team_member.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: nastyxxaavs_user
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    email character varying NOT NULL,
    status character varying DEFAULT 'UNAUTHORIZED'::character varying,
    role character varying DEFAULT 'CLIENT'::character varying,
    "firmId" integer,
    CONSTRAINT user_role_check CHECK (((role)::text = ANY ((ARRAY['CLIENT'::character varying, 'ADMIN'::character varying, 'EMPLOYEE'::character varying])::text[]))),
    CONSTRAINT user_status_check CHECK (((status)::text = ANY ((ARRAY['AUTHORIZED'::character varying, 'UNAUTHORIZED'::character varying])::text[])))
);


ALTER TABLE public."user" OWNER TO nastyxxaavs_user;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: nastyxxaavs_user
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO nastyxxaavs_user;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nastyxxaavs_user
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: client_request_entity id; Type: DEFAULT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.client_request_entity ALTER COLUMN id SET DEFAULT nextval('public.client_request_id_seq'::regclass);


--
-- Name: contact id; Type: DEFAULT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.contact ALTER COLUMN id SET DEFAULT nextval('public.contact_id_seq'::regclass);


--
-- Name: firm id; Type: DEFAULT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.firm ALTER COLUMN id SET DEFAULT nextval('public.firm_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: service id; Type: DEFAULT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.service ALTER COLUMN id SET DEFAULT nextval('public.service_id_seq'::regclass);


--
-- Name: submission id; Type: DEFAULT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.submission ALTER COLUMN id SET DEFAULT nextval('public.form_id_seq'::regclass);


--
-- Name: team_member id; Type: DEFAULT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.team_member ALTER COLUMN id SET DEFAULT nextval('public.team_member_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: client_request_entity; Type: TABLE DATA; Schema: public; Owner: nastyxxaavs_user
--

COPY public.client_request_entity (id, "clientName", "contactInfo", "requestDate", status, "firmId", "usersId", "teamMemberId", "serviceId", "serviceRequested") FROM stdin;
3	gfd	6543	2025-04-01 22:54:43.027	В процессе	1	2	1	1	1
2	trefgre	76543	2025-03-31 00:41:38.505	В процессе	1	2	1	1	1
\.


--
-- Data for Name: contact; Type: TABLE DATA; Schema: public; Owner: nastyxxaavs_user
--

COPY public.contact (id, address, phone, email, "mapsLink", "firmId") FROM stdin;
2	hgfdfds9876543	8765432	eee@gmail.com	dgfrewq	1
5	grfe	344632	hgtr4ed@gmail.com	rgbvcdsx	2
6	hfgdfs	76543	gfedw@gmail.com	hgrfed	2
9	dd	44	gfds@gmail.com	ggglala	2
\.


--
-- Data for Name: firm; Type: TABLE DATA; Schema: public; Owner: nastyxxaavs_user
--

COPY public.firm (id, name, description) FROM stdin;
2	lala	pupupupupup
1	Рога и копыта	Юридическая компания, всем советуем
4	pupupu	aaaaaaaaaaaaaa
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: nastyxxaavs_user
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
1	1741758438236	CreateEntities1741758438236
2	1742812964083	AddFormsEntityAndEditOthers1742812964083
3	1742814356969	AddPrimaryKeyToForms1742814356969
\.


--
-- Data for Name: service; Type: TABLE DATA; Schema: public; Owner: nastyxxaavs_user
--

COPY public.service (id, name, description, category, price, "firmId") FROM stdin;
1	fdsa	gfdsa	Контракты	555	1
\.


--
-- Data for Name: service_team_member; Type: TABLE DATA; Schema: public; Owner: nastyxxaavs_user
--

COPY public.service_team_member ("serviceId", "teamMemberId") FROM stdin;
\.


--
-- Data for Name: service_user; Type: TABLE DATA; Schema: public; Owner: nastyxxaavs_user
--

COPY public.service_user ("serviceId", "userId") FROM stdin;
\.


--
-- Data for Name: submission; Type: TABLE DATA; Schema: public; Owner: nastyxxaavs_user
--

COPY public.submission (id, name, email, "createdAt") FROM stdin;
2	hgfds	fds@gmail.com	2025-04-01 18:44:28.281
\.


--
-- Data for Name: team_member; Type: TABLE DATA; Schema: public; Owner: nastyxxaavs_user
--

COPY public.team_member (id, "firstName", "lastName", "position", "firmId") FROM stdin;
1	fdsa	fdsa	Начальник отдела	1
2	aa	aa	HR	2
4	kiki	miki	Ведущий юрист	1
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: nastyxxaavs_user
--

COPY public."user" (id, username, password, email, status, role, "firmId") FROM stdin;
2	gregory	12345	fgfds@gmail.com	AUTHORIZED	CLIENT	1
3	lali	12345	gfds@gmail.com	AUTHORIZED	CLIENT	\N
\.


--
-- Name: client_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nastyxxaavs_user
--

SELECT pg_catalog.setval('public.client_request_id_seq', 4, true);


--
-- Name: contact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nastyxxaavs_user
--

SELECT pg_catalog.setval('public.contact_id_seq', 9, true);


--
-- Name: firm_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nastyxxaavs_user
--

SELECT pg_catalog.setval('public.firm_id_seq', 4, true);


--
-- Name: form_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nastyxxaavs_user
--

SELECT pg_catalog.setval('public.form_id_seq', 2, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nastyxxaavs_user
--

SELECT pg_catalog.setval('public.migrations_id_seq', 3, true);


--
-- Name: service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nastyxxaavs_user
--

SELECT pg_catalog.setval('public.service_id_seq', 3, true);


--
-- Name: team_member_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nastyxxaavs_user
--

SELECT pg_catalog.setval('public.team_member_id_seq', 4, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nastyxxaavs_user
--

SELECT pg_catalog.setval('public.user_id_seq', 3, true);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: client_request_entity client_request_pkey; Type: CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.client_request_entity
    ADD CONSTRAINT client_request_pkey PRIMARY KEY (id);


--
-- Name: contact contact_pkey; Type: CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.contact
    ADD CONSTRAINT contact_pkey PRIMARY KEY (id);


--
-- Name: firm firm_pkey; Type: CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.firm
    ADD CONSTRAINT firm_pkey PRIMARY KEY (id);


--
-- Name: submission form_pkey; Type: CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.submission
    ADD CONSTRAINT form_pkey PRIMARY KEY (id);


--
-- Name: service service_pkey; Type: CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.service
    ADD CONSTRAINT service_pkey PRIMARY KEY (id);


--
-- Name: service_team_member service_team_member_pkey; Type: CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.service_team_member
    ADD CONSTRAINT service_team_member_pkey PRIMARY KEY ("serviceId", "teamMemberId");


--
-- Name: service_user service_user_pkey; Type: CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.service_user
    ADD CONSTRAINT service_user_pkey PRIMARY KEY ("serviceId", "userId");


--
-- Name: team_member team_member_pkey; Type: CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.team_member
    ADD CONSTRAINT team_member_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: client_request_entity FK_serviceRequested; Type: FK CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.client_request_entity
    ADD CONSTRAINT "FK_serviceRequested" FOREIGN KEY ("serviceRequested") REFERENCES public.service(id) ON DELETE CASCADE;


--
-- Name: client_request_entity client_request_firmId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.client_request_entity
    ADD CONSTRAINT "client_request_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES public.firm(id) ON DELETE CASCADE;


--
-- Name: client_request_entity client_request_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.client_request_entity
    ADD CONSTRAINT "client_request_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public.service(id) ON DELETE CASCADE;


--
-- Name: client_request_entity client_request_teamMemberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.client_request_entity
    ADD CONSTRAINT "client_request_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES public.team_member(id) ON DELETE CASCADE;


--
-- Name: client_request_entity client_request_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.client_request_entity
    ADD CONSTRAINT "client_request_userId_fkey" FOREIGN KEY ("usersId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: contact contact_firmId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.contact
    ADD CONSTRAINT "contact_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES public.firm(id) ON DELETE CASCADE;


--
-- Name: service service_firmId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.service
    ADD CONSTRAINT "service_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES public.firm(id) ON DELETE CASCADE;


--
-- Name: service_team_member service_team_member_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.service_team_member
    ADD CONSTRAINT "service_team_member_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public.service(id) ON DELETE CASCADE;


--
-- Name: service_team_member service_team_member_teamMemberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.service_team_member
    ADD CONSTRAINT "service_team_member_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES public.team_member(id) ON DELETE CASCADE;


--
-- Name: service_user service_user_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.service_user
    ADD CONSTRAINT "service_user_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public.service(id) ON DELETE CASCADE;


--
-- Name: service_user service_user_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.service_user
    ADD CONSTRAINT "service_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: team_member team_member_firmId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public.team_member
    ADD CONSTRAINT "team_member_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES public.firm(id) ON DELETE CASCADE;


--
-- Name: user user_firmId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nastyxxaavs_user
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "user_firmId_fkey" FOREIGN KEY ("firmId") REFERENCES public.firm(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES TO nastyxxaavs_user;


--
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES TO nastyxxaavs_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS TO nastyxxaavs_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO nastyxxaavs_user;


--
-- PostgreSQL database dump complete
--

