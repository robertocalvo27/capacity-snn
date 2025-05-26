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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      part_numbers: {
        Row: {
          code: string
          description: string | null
          labor_std: number
          total_hc: number
          value_stream_id:
            | Database["public"]["Enums"]["value_stream_type"]
            | null
        }
        Insert: {
          code: string
          description?: string | null
          labor_std: number
          total_hc?: number
          value_stream_id?:
            | Database["public"]["Enums"]["value_stream_type"]
            | null
        }
        Update: {
          code?: string
          description?: string | null
          labor_std?: number
          total_hc?: number
          value_stream_id?:
            | Database["public"]["Enums"]["value_stream_type"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "part_numbers_value_stream_id_fkey"
            columns: ["value_stream_id"]
            isOneToOne: false
            referencedRelation: "value_streams"
            referencedColumns: ["id"]
          },
        ]
      }
      production_entries: {
        Row: {
          additional_hc: number | null
          created_at: string | null
          daily_production: number | null
          delta: number | null
          downtime: number | null
          entry_date: string
          hour: string
          hourly_target: number | null
          id: string
          line_id: string | null
          part_number_code: string | null
          real_head_count: number | null
          shift: number | null
          updated_at: string | null
          work_order: string | null
        }
        Insert: {
          additional_hc?: number | null
          created_at?: string | null
          daily_production?: number | null
          delta?: number | null
          downtime?: number | null
          entry_date: string
          hour: string
          hourly_target?: number | null
          id: string
          line_id?: string | null
          part_number_code?: string | null
          real_head_count?: number | null
          shift?: number | null
          updated_at?: string | null
          work_order?: string | null
        }
        Update: {
          additional_hc?: number | null
          created_at?: string | null
          daily_production?: number | null
          delta?: number | null
          downtime?: number | null
          entry_date?: string
          hour?: string
          hourly_target?: number | null
          id?: string
          line_id?: string | null
          part_number_code?: string | null
          real_head_count?: number | null
          shift?: number | null
          updated_at?: string | null
          work_order?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_entries_line_id_fkey"
            columns: ["line_id"]
            isOneToOne: false
            referencedRelation: "production_lines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_entries_part_number_code_fkey"
            columns: ["part_number_code"]
            isOneToOne: false
            referencedRelation: "part_numbers"
            referencedColumns: ["code"]
          },
        ]
      }
      production_lines: {
        Row: {
          id: string
          is_active: boolean | null
          name: string
          value_stream_id:
            | Database["public"]["Enums"]["value_stream_type"]
            | null
        }
        Insert: {
          id: string
          is_active?: boolean | null
          name: string
          value_stream_id?:
            | Database["public"]["Enums"]["value_stream_type"]
            | null
        }
        Update: {
          id?: string
          is_active?: boolean | null
          name?: string
          value_stream_id?:
            | Database["public"]["Enums"]["value_stream_type"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "production_lines_value_stream_id_fkey"
            columns: ["value_stream_id"]
            isOneToOne: false
            referencedRelation: "value_streams"
            referencedColumns: ["id"]
          },
        ]
      }
      run_rates: {
        Row: {
          head_count: number
          id: number
          part_number_code: string | null
          rate: number
          shift: number | null
        }
        Insert: {
          head_count: number
          id?: number
          part_number_code?: string | null
          rate: number
          shift?: number | null
        }
        Update: {
          head_count?: number
          id?: number
          part_number_code?: string | null
          rate?: number
          shift?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "run_rates_part_number_code_fkey"
            columns: ["part_number_code"]
            isOneToOne: false
            referencedRelation: "part_numbers"
            referencedColumns: ["code"]
          },
        ]
      }
      value_streams: {
        Row: {
          description: string | null
          id: Database["public"]["Enums"]["value_stream_type"]
          name: string
        }
        Insert: {
          description?: string | null
          id: Database["public"]["Enums"]["value_stream_type"]
          name: string
        }
        Update: {
          description?: string | null
          id?: Database["public"]["Enums"]["value_stream_type"]
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      value_stream_type: "ENT" | "JR" | "SM" | "FIX" | "EA" | "APO" | "WND"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
