PGDMP  (                     }            test-db    16.2 (Debian 16.2-1.pgdg120+2)    16.6     1           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            2           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            3           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            4           1262    16384    test-db    DATABASE     t   CREATE DATABASE "test-db" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE "test-db";
                postgres    false                        2615    24629    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                postgres    false            5           0    0    SCHEMA public    ACL     +   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
                   postgres    false    5            M           1247    24640    Role    TYPE     N   CREATE TYPE public."Role" AS ENUM (
    'USER',
    'MANAGER',
    'ADMIN'
);
    DROP TYPE public."Role";
       public          postgres    false    5            �            1259    24630    _prisma_migrations    TABLE     �  CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);
 &   DROP TABLE public._prisma_migrations;
       public         heap    postgres    false    5            �            1259    24657    posts    TABLE     .  CREATE TABLE public.posts (
    id text NOT NULL,
    title character varying(255) NOT NULL,
    content character varying(2048),
    "authorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public.posts;
       public         heap    postgres    false    5            �            1259    24647    users    TABLE     �  CREATE TABLE public.users (
    id text NOT NULL,
    username text NOT NULL,
    name text,
    avatar text,
    password text NOT NULL,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false    845    845    5            ,          0    24630    _prisma_migrations 
   TABLE DATA           �   COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
    public          postgres    false    215          .          0    24657    posts 
   TABLE DATA           Y   COPY public.posts (id, title, content, "authorId", "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    217   �       -          0    24647    users 
   TABLE DATA           n   COPY public.users (id, username, name, avatar, password, role, enabled, "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    216   �       �           2606    24638 *   _prisma_migrations _prisma_migrations_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
       public            postgres    false    215            �           2606    24664    posts posts_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_pkey;
       public            postgres    false    217            �           2606    24656    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            �           1259    24667    idx_post_title    INDEX     A   CREATE INDEX idx_post_title ON public.posts USING btree (title);
 "   DROP INDEX public.idx_post_title;
       public            postgres    false    217            �           1259    24666    idx_user_username    INDEX     G   CREATE INDEX idx_user_username ON public.users USING btree (username);
 %   DROP INDEX public.idx_user_username;
       public            postgres    false    216            �           1259    24665    users_username_key    INDEX     O   CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);
 &   DROP INDEX public.users_username_key;
       public            postgres    false    216            �           2606    24668    posts posts_authorId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 E   ALTER TABLE ONLY public.posts DROP CONSTRAINT "posts_authorId_fkey";
       public          postgres    false    217    216    3223            ,   �   x�m�9
�0@��:E� 3�U�C����nR�������%L�3�p��=W��`���ɾA�6*ΰ%�*�\:�(2�y�ګ�����1�|u����tC@ɀ�� <wG5�;��b)"@��^�{;��:Pu����=����-�      .      x������ � �      -   �   x�uȻ�0 й|k���Qؚ��4D�1,�!�����p<' ��>mQ�;���O#ƀ�<�m���v��I�ngN�7�@�y*s.�vD�����N͟��/��{<���jLԯ*�5QI��d%���(pD̽�+C��V�Z��G�0&     