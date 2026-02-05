CREATE TYPE "public"."payout_type" AS ENUM('cpa', 'fixed', 'cpa_fixed');--> statement-breakpoint
CREATE TABLE "custom_payouts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"offer_id" uuid NOT NULL,
	"influencer_id" uuid NOT NULL,
	"payout_type" "payout_type" NOT NULL,
	"cpa_amount" numeric(10, 2),
	"fixed_amount" numeric(10, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "custom_payouts_offer_id_influencer_id_unique" UNIQUE("offer_id","influencer_id")
);
--> statement-breakpoint
CREATE TABLE "influencers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "influencers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"payout_type" "payout_type" NOT NULL,
	"cpa_amount" numeric(10, 2),
	"fixed_amount" numeric(10, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "custom_payouts" ADD CONSTRAINT "custom_payouts_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_payouts" ADD CONSTRAINT "custom_payouts_influencer_id_influencers_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "public"."influencers"("id") ON DELETE cascade ON UPDATE no action;