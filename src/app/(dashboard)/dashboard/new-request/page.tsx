"use client";
import { toWords } from "number-to-words";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PopoverContent } from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { FormSchema } from "@/lib/constant";
import { fileRequest } from "@/lib/actions";
import { useToast } from "@/components/ui/use-toast";

const NewRequest = () => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      appointmentConfirmed: false,
      amount: "",
      salaryPerAnnum: "",
      conuass: "",
      department: "Computer Science",
      departmentCode: "CS",
      unit: "",
      fullname: "",
      staffId: "",
      dateOfBirth: undefined,
      dateOfFirstAppointment: undefined,
      dateToRetireAdvance: undefined,
      purpose: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { request, errors } = await fileRequest(data);

    if (errors) {
      console.log(errors);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem trying to file your request.",
      });
    } else {
      console.log(request);
      form.reset();
      toast({
        variant: "default",
        title: "Request submitted successfully.",
        description: "Your request has been submitted for review.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-4">
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Applicant&apos;s Full Name.{" "}
                    <span className="text-foreground">(Surname First)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="staffId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff I/D No.</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-7 gap-4">
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="departmentCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Departmental Code</FormLabel>
                  <FormControl>
                    <Input disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-2">
            {/* @ts-ignore */}
            <DateForm form={form} label="Date of Birth" name="dateOfBirth" />
          </div>
          <div className="col-span-2">
            <DateForm
              // @ts-ignore
              form={form}
              label="Date of First Appointment"
              name="dateOfFirstAppointment"
            />
          </div>
          <div className="col-span-1">
            <FormField
              control={form.control}
              name="appointmentConfirmed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment confirmed?</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2 min-h-9">
                      <Label htmlFor="appointment-confirmed">No</Label>
                      <Switch id="appointment-confirmed" />
                      <Label htmlFor="appointment-confirmed">Yes</Label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <FormField
              control={form.control}
              name="salaryPerAnnum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary per Annum.</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1">
            <FormField
              control={form.control}
              name="conuass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CONUASS/CONTISS.</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount of Advance required</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormDescription>
                    <div className="text-xs text-black font-semibold">
                      <span className="italic">
                        {toWords(form.watch("amount") || 0).toUpperCase()} NAIRA
                        ONLY
                      </span>
                    </div>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormDescription></FormDescription>
          </div>
          <div className="col-span-1">
            {/* TODO:
                Add a prompt on change to notify:

                Late submission of "statement "may result in salary cut which cannot be refunded except by addition to subsequent Salary payment in the month following that in which the statement is received.

            */}

            <DateForm
              // @ts-ignore
              form={form}
              label="Date by which advance will be retired"
              name="dateToRetireAdvance"
              allowFuture
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose for which advance is required</FormLabel>
              <FormControl>
                <Textarea placeholder="" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

const DateForm = ({
  form,
  label,
  name,
  allowFuture = false,
}: {
  form: ReturnType<typeof useForm>;
  label: string;
  name: string;
  allowFuture?: boolean;
}) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex flex-col gap-1 pt-[6px]">
        <FormLabel>{label}</FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant={"outline"}
                className={cn(!field.value && "text-muted-foreground")}
              >
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 bg-white border rounded-md z-50"
            align="start"
          >
            <Calendar
              mode="single"
              // @ts-ignore
              selected={field.value}
              onSelect={field.onChange}
              disabled={(date) => {
                if (!allowFuture) {
                  return date > new Date() || date < new Date("1900-01-01");
                } else {
                  return date < new Date();
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default NewRequest;
