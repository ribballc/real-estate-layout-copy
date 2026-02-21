export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      add_ons: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          popular: boolean
          price: number
          service_id: string
          sort_order: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          popular?: boolean
          price?: number
          service_id: string
          sort_order?: number
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          popular?: boolean
          price?: number
          service_id?: string
          sort_order?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "add_ons_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      blocked_days: {
        Row: {
          blocked_date: string
          created_at: string
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          blocked_date: string
          created_at?: string
          id?: string
          reason?: string
          user_id: string
        }
        Update: {
          blocked_date?: string
          created_at?: string
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_date: string
          booking_time: string
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          duration_minutes: number
          id: string
          notes: string
          service_price: number
          service_title: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          duration_minutes?: number
          id?: string
          notes?: string
          service_price?: number
          service_title?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          duration_minutes?: number
          id?: string
          notes?: string
          service_price?: number
          service_title?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      business_hours: {
        Row: {
          close_time: string
          created_at: string
          day_of_week: number
          id: string
          is_closed: boolean
          open_time: string
          user_id: string
        }
        Insert: {
          close_time?: string
          created_at?: string
          day_of_week: number
          id?: string
          is_closed?: boolean
          open_time?: string
          user_id: string
        }
        Update: {
          close_time?: string
          created_at?: string
          day_of_week?: number
          id?: string
          is_closed?: boolean
          open_time?: string
          user_id?: string
        }
        Relationships: []
      }
      churn_reasons: {
        Row: {
          canceled_at: string
          created_at: string
          detail: string
          id: string
          offer_accepted: boolean
          offer_shown: string
          reason: string
          user_id: string
        }
        Insert: {
          canceled_at?: string
          created_at?: string
          detail?: string
          id?: string
          offer_accepted?: boolean
          offer_shown?: string
          reason?: string
          user_id: string
        }
        Update: {
          canceled_at?: string
          created_at?: string
          detail?: string
          id?: string
          offer_accepted?: boolean
          offer_shown?: string
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string
          email: string
          id: string
          last_service_date: string | null
          name: string
          notes: string
          phone: string
          status: string
          total_bookings: number
          total_spent: number
          updated_at: string
          user_id: string
          vehicle: string
        }
        Insert: {
          created_at?: string
          email?: string
          id?: string
          last_service_date?: string | null
          name?: string
          notes?: string
          phone?: string
          status?: string
          total_bookings?: number
          total_spent?: number
          updated_at?: string
          user_id: string
          vehicle?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_service_date?: string | null
          name?: string
          notes?: string
          phone?: string
          status?: string
          total_bookings?: number
          total_spent?: number
          updated_at?: string
          user_id?: string
          vehicle?: string
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          error_message: string
          id: string
          occurred_at: string
          page_url: string
          stack_trace: string
          user_id: string | null
        }
        Insert: {
          error_message?: string
          id?: string
          occurred_at?: string
          page_url?: string
          stack_trace?: string
          user_id?: string | null
        }
        Update: {
          error_message?: string
          id?: string
          occurred_at?: string
          page_url?: string
          stack_trace?: string
          user_id?: string | null
        }
        Relationships: []
      }
      estimates: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          discount_amount: number
          discount_type: string
          id: string
          notes: string
          services: Json
          status: string
          subtotal: number
          tax_rate: number
          total: number
          updated_at: string
          user_id: string
          valid_until: string | null
          vehicle: string
        }
        Insert: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          discount_amount?: number
          discount_type?: string
          id?: string
          notes?: string
          services?: Json
          status?: string
          subtotal?: number
          tax_rate?: number
          total?: number
          updated_at?: string
          user_id: string
          valid_until?: string | null
          vehicle?: string
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          discount_amount?: number
          discount_type?: string
          id?: string
          notes?: string
          services?: Json
          status?: string
          subtotal?: number
          tax_rate?: number
          total?: number
          updated_at?: string
          user_id?: string
          valid_until?: string | null
          vehicle?: string
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          created_at: string
          description: string
          enabled_for_user_ids: string[]
          enabled_globally: boolean
          flag_name: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          enabled_for_user_ids?: string[]
          enabled_globally?: boolean
          flag_name: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          enabled_for_user_ids?: string[]
          enabled_globally?: boolean
          flag_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      feature_requests: {
        Row: {
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          caption: string
          created_at: string
          id: string
          sort_order: number
          url: string
          user_id: string
        }
        Insert: {
          caption?: string
          created_at?: string
          id?: string
          sort_order?: number
          url: string
          user_id: string
        }
        Update: {
          caption?: string
          created_at?: string
          id?: string
          sort_order?: number
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_deleted: boolean
          acquisition_landing_url: string | null
          address: string
          business_name: string
          churn_risk: boolean
          created_at: string
          deleted_at: string | null
          email: string
          facebook: string
          fbc: string | null
          fbp: string | null
          google_business: string
          id: string
          instagram: string
          last_login_at: string | null
          last_weekly_summary_shown_at: string | null
          logo_url: string | null
          map_query: string
          no_business_address: boolean | null
          offer_lab_progress: Json | null
          onboarding_complete: boolean
          phone: string
          primary_color: string | null
          qr_code_url: string | null
          secondary_color: string | null
          service_areas: string[] | null
          slug: string | null
          sms_consent: boolean
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_ends_at: string | null
          subscription_plan: string | null
          subscription_status: string
          tagline: string
          tiktok: string
          trial_active: boolean
          trial_ends_at: string | null
          unsubscribed_from_emails: boolean
          updated_at: string
          user_id: string
          wants_custom_domain: boolean
          requested_domain: string | null
          domain_requested_at: string | null
          custom_domain: string | null
          youtube: string
        }
        Insert: {
          account_deleted?: boolean
          acquisition_landing_url?: string | null
          address?: string
          business_name?: string
          churn_risk?: boolean
          created_at?: string
          deleted_at?: string | null
          email?: string
          facebook?: string
          fbc?: string | null
          fbp?: string | null
          google_business?: string
          id?: string
          instagram?: string
          last_login_at?: string | null
          last_weekly_summary_shown_at?: string | null
          logo_url?: string | null
          map_query?: string
          no_business_address?: boolean | null
          offer_lab_progress?: Json | null
          onboarding_complete?: boolean
          phone?: string
          primary_color?: string | null
          qr_code_url?: string | null
          secondary_color?: string | null
          service_areas?: string[] | null
          slug?: string | null
          sms_consent?: boolean
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_ends_at?: string | null
          subscription_plan?: string | null
          subscription_status?: string
          tagline?: string
          tiktok?: string
          trial_active?: boolean
          trial_ends_at?: string | null
          unsubscribed_from_emails?: boolean
          updated_at?: string
          user_id: string
          wants_custom_domain?: boolean
          requested_domain?: string | null
          domain_requested_at?: string | null
          custom_domain?: string | null
          youtube?: string
        }
        Update: {
          account_deleted?: boolean
          acquisition_landing_url?: string | null
          address?: string
          business_name?: string
          churn_risk?: boolean
          created_at?: string
          deleted_at?: string | null
          email?: string
          facebook?: string
          fbc?: string | null
          fbp?: string | null
          google_business?: string
          id?: string
          instagram?: string
          last_login_at?: string | null
          last_weekly_summary_shown_at?: string | null
          logo_url?: string | null
          map_query?: string
          no_business_address?: boolean | null
          offer_lab_progress?: Json | null
          onboarding_complete?: boolean
          phone?: string
          primary_color?: string | null
          qr_code_url?: string | null
          secondary_color?: string | null
          service_areas?: string[] | null
          slug?: string | null
          sms_consent?: boolean
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_ends_at?: string | null
          subscription_plan?: string | null
          subscription_status?: string
          tagline?: string
          tiktok?: string
          trial_active?: boolean
          trial_ends_at?: string | null
          unsubscribed_from_emails?: boolean
          updated_at?: string
          user_id?: string
          wants_custom_domain?: boolean
          requested_domain?: string | null
          domain_requested_at?: string | null
          custom_domain?: string | null
          youtube?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          endpoint: string
          id: string
          ip_address: string
          request_count: number
          window_start: string
        }
        Insert: {
          endpoint?: string
          id?: string
          ip_address: string
          request_count?: number
          window_start?: string
        }
        Update: {
          endpoint?: string
          id?: string
          ip_address?: string
          request_count?: number
          window_start?: string
        }
        Relationships: []
      }
      service_option_groups: {
        Row: {
          created_at: string
          description: string
          id: string
          option_type: string
          required: boolean
          service_id: string
          slider_default: number | null
          slider_max: number | null
          slider_min: number | null
          slider_step: number | null
          slider_unit: string | null
          sort_order: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          option_type?: string
          required?: boolean
          service_id: string
          slider_default?: number | null
          slider_max?: number | null
          slider_min?: number | null
          slider_step?: number | null
          slider_unit?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          option_type?: string
          required?: boolean
          service_id?: string
          slider_default?: number | null
          slider_max?: number | null
          slider_min?: number | null
          slider_step?: number | null
          slider_unit?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_option_groups_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_option_items: {
        Row: {
          created_at: string
          description: string
          group_id: string
          id: string
          label: string
          price_modifier: number
          sort_order: number
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          group_id: string
          id?: string
          label?: string
          price_modifier?: number
          sort_order?: number
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          group_id?: string
          id?: string
          label?: string
          price_modifier?: number
          sort_order?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_option_items_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "service_option_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          popular: boolean
          price: number
          sort_order: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          popular?: boolean
          price?: number
          sort_order?: number
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          popular?: boolean
          price?: number
          sort_order?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author: string
          content: string
          created_at: string
          id: string
          photo_url: string | null
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          author?: string
          content?: string
          created_at?: string
          id?: string
          photo_url?: string | null
          rating?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          id?: string
          photo_url?: string | null
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trial_retention_sms: {
        Row: {
          created_at: string
          error: string | null
          id: string
          is_test: boolean
          phone: string
          sent_at: string
          step: number
          user_id: string
        }
        Insert: {
          created_at?: string
          error?: string | null
          id?: string
          is_test?: boolean
          phone?: string
          sent_at?: string
          step: number
          user_id: string
        }
        Update: {
          created_at?: string
          error?: string | null
          id?: string
          is_test?: boolean
          phone?: string
          sent_at?: string
          step?: number
          user_id?: string
        }
        Relationships: []
      }
      user_emails_sent: {
        Row: {
          clicked_at: string | null
          email_type: string
          id: string
          opened_at: string | null
          sent_at: string
          user_id: string
        }
        Insert: {
          clicked_at?: string | null
          email_type: string
          id?: string
          opened_at?: string | null
          sent_at?: string
          user_id: string
        }
        Update: {
          clicked_at?: string | null
          email_type?: string
          id?: string
          opened_at?: string | null
          sent_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      website_copy: {
        Row: {
          about_paragraph: string
          about_paragraph_edited: boolean
          created_at: string
          cta_tagline: string
          cta_tagline_edited: boolean
          generated_at: string
          hero_headline: string
          hero_headline_edited: boolean
          hero_subheadline: string
          hero_subheadline_edited: boolean
          id: string
          seo_meta_description: string
          seo_meta_description_edited: boolean
          services_descriptions: Json
          services_descriptions_edited: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          about_paragraph?: string
          about_paragraph_edited?: boolean
          created_at?: string
          cta_tagline?: string
          cta_tagline_edited?: boolean
          generated_at?: string
          hero_headline?: string
          hero_headline_edited?: boolean
          hero_subheadline?: string
          hero_subheadline_edited?: boolean
          id?: string
          seo_meta_description?: string
          seo_meta_description_edited?: boolean
          services_descriptions?: Json
          services_descriptions_edited?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          about_paragraph?: string
          about_paragraph_edited?: boolean
          created_at?: string
          cta_tagline?: string
          cta_tagline_edited?: boolean
          generated_at?: string
          hero_headline?: string
          hero_headline_edited?: boolean
          hero_subheadline?: string
          hero_subheadline_edited?: boolean
          id?: string
          seo_meta_description?: string
          seo_meta_description_edited?: boolean
          services_descriptions?: Json
          services_descriptions_edited?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
