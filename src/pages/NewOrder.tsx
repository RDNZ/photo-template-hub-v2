import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  event_name: z.string().min(1, "Event name is required"),
  software_type: z.string().min(1, "Software type is required"),
  dimensions: z.string().min(1, "Dimensions are required"),
  turnaround_time: z.string().min(1, "Turnaround time is required"),
});

const NewOrder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is authenticated and is a client
  useState(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profile?.role !== "client") {
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      event_name: "",
      software_type: "",
      dimensions: "",
      turnaround_time: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Calculate price based on software type and turnaround time
      let price = 0;
      switch (values.software_type) {
        case "photoshop":
          price = 50;
          break;
        case "illustrator":
          price = 75;
          break;
        case "after_effects":
          price = 100;
          break;
        default:
          price = 50;
      }

      // Add rush fee for faster turnaround
      if (values.turnaround_time === "24h") {
        price *= 1.5;
      } else if (values.turnaround_time === "48h") {
        price *= 1.25;
      }

      const { error } = await supabase.from("orders").insert({
        ...values,
        price,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your order has been submitted successfully",
      });
      navigate("/client-dashboard");
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit order. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">New Order</h1>
          <p className="text-muted-foreground mt-2">
            Please fill out the form below to submit a new order
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="event_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="software_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Software Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select software type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="photoshop">Photoshop ($50)</SelectItem>
                      <SelectItem value="illustrator">
                        Illustrator ($75)
                      </SelectItem>
                      <SelectItem value="after_effects">
                        After Effects ($100)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dimensions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dimensions</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter dimensions (e.g., 1920x1080)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="turnaround_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Turnaround Time</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select turnaround time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="24h">24 Hours (+50%)</SelectItem>
                      <SelectItem value="48h">48 Hours (+25%)</SelectItem>
                      <SelectItem value="72h">72 Hours (Standard)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/client-dashboard")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Order"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default NewOrder;