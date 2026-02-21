export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      houses: {
        Row: {
          address: string
          created_at: string
          floors: number
          id: string
          name: string
          remarks: string | null
          rooms: number
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string
          floors?: number
          id?: string
          name: string
          remarks?: string | null
          rooms?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          floors?: number
          id?: string
          name?: string
          remarks?: string | null
          rooms?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      monthly_billing: {
        Row: {
          billing_month: number
          billing_year: number
          created_at: string
          electricity_bill_type: string
          electricity_fixed_amount: number | null
          electricity_rate: number | null
          electricity_total: number | null
          electricity_units: number | null
          extra_charges: Json | null
          grand_total: number | null
          house_id: string
          id: string
          paid_amount: number
          payment_date: string | null
          payment_mode: string | null
          payment_status: string
          previous_month_dues: number | null
          remaining_due: number | null
          rent_amount: number
          sanitation_charge: number
          tenant_id: string
          total_amount: number
          updated_at: string
          user_id: string
          water_bill_type: string
          water_fixed_amount: number | null
          water_rate: number | null
          water_total: number | null
          water_units: number | null
        }
        Insert: {
          billing_month: number
          billing_year: number
          created_at?: string
          electricity_bill_type?: string
          electricity_fixed_amount?: number | null
          electricity_rate?: number | null
          electricity_total?: number | null
          electricity_units?: number | null
          extra_charges?: Json | null
          grand_total?: number | null
          house_id: string
          id?: string
          paid_amount?: number
          payment_date?: string | null
          payment_mode?: string | null
          payment_status?: string
          previous_month_dues?: number | null
          remaining_due?: number | null
          rent_amount?: number
          sanitation_charge?: number
          tenant_id: string
          total_amount?: number
          updated_at?: string
          user_id: string
          water_bill_type?: string
          water_fixed_amount?: number | null
          water_rate?: number | null
          water_total?: number | null
          water_units?: number | null
        }
        Update: {
          billing_month?: number
          billing_year?: number
          created_at?: string
          electricity_bill_type?: string
          electricity_fixed_amount?: number | null
          electricity_rate?: number | null
          electricity_total?: number | null
          electricity_units?: number | null
          extra_charges?: Json | null
          grand_total?: number | null
          house_id?: string
          id?: string
          paid_amount?: number
          payment_date?: string | null
          payment_mode?: string | null
          payment_status?: string
          previous_month_dues?: number | null
          remaining_due?: number | null
          rent_amount?: number
          sanitation_charge?: number
          tenant_id?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
          water_bill_type?: string
          water_fixed_amount?: number | null
          water_rate?: number | null
          water_total?: number | null
          water_units?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "monthly_billing_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "monthly_billing_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          address: string | null
          citizenship_number: string | null
          created_at: string
          family_members: number | null
          house_id: string
          id: string
          is_active: boolean
          monthly_rent: number
          move_in_date: string
          name: string
          occupation: string | null
          phone: string | null
          remarks: string | null
          room_number: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          citizenship_number?: string | null
          created_at?: string
          family_members?: number | null
          house_id: string
          id?: string
          is_active?: boolean
          monthly_rent?: number
          move_in_date?: string
          name: string
          occupation?: string | null
          phone?: string | null
          remarks?: string | null
          room_number: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          citizenship_number?: string | null
          created_at?: string
          family_members?: number | null
          house_id?: string
          id?: string
          is_active?: boolean
          monthly_rent?: number
          move_in_date?: string
          name?: string
          occupation?: string | null
          phone?: string | null
          remarks?: string | null
          room_number?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenants_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "houses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_previous_month_dues: {
        Args: { billing_month: number; billing_year: number; tenant_id: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

