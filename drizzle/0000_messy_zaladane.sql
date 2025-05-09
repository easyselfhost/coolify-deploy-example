CREATE TABLE `Todo` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`status` text NOT NULL,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer NOT NULL
);
