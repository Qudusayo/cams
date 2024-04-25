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
import { cn, formatMoney } from "@/lib/utils";
import { PopoverContent } from "@radix-ui/react-popover";
import { CalendarIcon, Dot } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { FormSchema } from "@/lib/constant";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { updateRequest } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { Form as FormType, Status, FormStatus } from "@prisma/client";
import { statusView } from "@/components/request-row";
import moment from "moment";

type iFormData = FormType & {
  statuses: ({
    updatedBy: { name: string | null };
  } & Status)[];
};

const Request = ({
  formData,
  viewOnly,
}: {
  formData: iFormData;
  viewOnly?: boolean;
}) => {
  const { toast } = useToast();
  const [isApproved, setIsApproved] = useState(false);

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

  async function acceptRequest() {
    let approveStatus: FormStatus;

    switch (formData.status) {
      case "SUBMITTED":
        approveStatus = "BURSERENDORSED";
        break;
      case "BURSERENDORSED":
        approveStatus = "HODENDORSED";
        break;
      case "HODENDORSED":
        approveStatus = "BURSERAPPROVED";
        break;
      case "BURSERAPPROVED":
        approveStatus = "LOANADVANCED";
        break;
      default:
        return;
    }

    if (approveStatus) {
      const result = await updateRequest(formData.id, approveStatus);
      if (result.created) {
        toast({
          title: "Request approved successfully.",
          description: "The request has updated accordingly.",
        });
        setIsApproved(true);
        return;
      }
    }
  }

  async function rejectRequest() {
    const result = await updateRequest(formData.id, "REJECTED");
    if (result.created) {
      toast({
        title: "Request rejected successfully.",
        description: "The request has been rejected.",
      });
      return;
    }
  }

  useEffect(() => {
    // Update the form with the data from the server
    form.reset({
      appointmentConfirmed: formData.appointmentConfirmed,
      amount: formData.amount.toString(),
      salaryPerAnnum: formData.salaryPerAnnum.toString(),
      conuass: formData.conuass.toString(),
      department: formData.department,
      departmentCode: formData.departmentCode,
      unit: formData.unit,
      fullname: formData.fullname,
      staffId: formData.staffId,
      dateOfBirth: new Date(formData.dateOfBirth),
      dateOfFirstAppointment: new Date(formData.dateOfFirstAppointment),
      dateToRetireAdvance: new Date(formData.dateToRetireAdvance),
      purpose: formData.purpose,
    });
  }, []);

  const index = formData.requestNo.toString().padStart(3, "0");

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold">REQUEST #{index}</h2>
        </div>

        <div className="space-y-2">
          <h3 className="text-3xl font-semibold text-right">
            {formatMoney(formData.amount)}
          </h3>
          {formData.status === "REJECTED" ? (
            <Badge
              variant="outline"
              className="relative pl-5 capitalize text-red-500"
            >
              <Dot size={50} className="absolute -left-4" />
              <span>REJECTED</span>
            </Badge>
          ) : isApproved ? (
            <Badge variant="default" className="relative pl-5 capitalize">
              <Dot size={50} className="absolute -left-4" />
              <span>Approved</span>
            </Badge>
          ) : viewOnly ? (
            <Badge
              variant="outline"
              className="relative uppercase pl-5 text-blue-500"
            >
              <Dot size={50} className="absolute -left-4" />
              <span>{statusView[formData.status]}</span>
            </Badge>
          ) : (
            <div className="space-x-4">
              <Button
                className="space-x-2 bg-destructive hover:bg-destructive hover:opacity-90"
                onClick={rejectRequest}
              >
                <span>Reject Request</span>
              </Button>
              <Button className="space-x-2" onClick={acceptRequest}>
                <span>Approve Request</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 rounded-2xl bg-white p-4 space-y-4">
        <Chained status="SUBMITTED" createdAt={formData.createdAt}>
          <Form {...form}>
            <div className="space-y-6">
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-4">
                  <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Applicant&apos;s Full Name.{" "}
                          <span className="text-foreground">
                            (Surname First)
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input readOnly {...field} />
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
                          <Input readOnly {...field} />
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
                          <Input readOnly {...field} />
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
                          <Input readOnly {...field} />
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
                          <Input readOnly {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-2">
                  <DateForm
                    // @ts-ignore
                    form={form}
                    label="Date of Birth"
                    name="dateOfBirth"
                  />
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
                            <Switch disabled id="appointment-confirmed" />
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
                          <Input readOnly {...field} />
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
                          <Input readOnly {...field} />
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
                          <Input readOnly type="tel" {...field} />
                        </FormControl>
                        <FormDescription>
                          <div className="text-xs text-black font-semibold">
                            <span className="italic">
                              {toWords(form.watch("amount") || 0).toUpperCase()}{" "}
                              NAIRA ONLY
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
                      <Textarea
                        placeholder=""
                        className="resize-none"
                        {...field}
                        readOnly
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </Chained>
        {formData.statuses.map((status) => (
          <Chained
            key={status.id}
            status={status.status}
            createdAt={status.createdAt}
            isLast={
              status.status === "LOANADVANCED" || status.status === "REJECTED"
            }
          >
            <div className="text-base space-x-1">
              <span>The request was</span>
              <Badge
                variant="default"
                className={cn(
                  "relative capitalize",
                  status.status === "REJECTED" ? "bg-red-500" : "bg-green-500"
                )}
              >
                <span>
                  {status.status === "REJECTED" ? "Rejected" : "Approved"}
                </span>
              </Badge>
              <span>by</span>
              <span className="font-semibold"> {status.updatedBy.name}</span>
            </div>
          </Chained>
        ))}
      </div>
    </div>
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
              disabled={true}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    )}
  />
);

const Chained = ({
  status,
  createdAt,
  children,
  isLast = false,
}: {
  status: FormStatus;
  createdAt: Date;
  children: React.ReactNode;
  isLast?: boolean;
}) => {
  const color =
    status === "REJECTED"
      ? "red-500"
      : status === "LOANADVANCED"
      ? "green-500"
      : "blue-500";

  const borderColor =
    status === "REJECTED"
      ? "border-red-500"
      : status === "LOANADVANCED"
      ? "border-green-500"
      : "border-blue-500";

  const bgColor =
    status === "REJECTED"
      ? "bg-red-500"
      : status === "LOANADVANCED"
      ? "bg-green-500"
      : "bg-blue-500";

  return (
    <div className="relative overflow-hidden">
      <div
        className={cn("w-4 h-4 rounded-full left-1 absolute top-1", bgColor)}
      ></div>
      {!isLast && (
        <div
          className={cn(
            "absolute border-dashed border-l h-full left-3 top-6",
            borderColor
          )}
        ></div>
      )}
      <div className="pl-8 mb-4 flex items-center gap-3">
        <Badge
          variant="outline"
          className={cn("relative uppercase", "text-" + color)}
        >
          {/* <Dot size={50} className="absolute -left-4" /> */}
          <span>{statusView[status]}</span>
        </Badge>
        <span className="text-sm uppercase">
          {moment(createdAt).format("MMMM Do YYYY, h:mm a")}
        </span>
      </div>
      <div className="pl-8">{children}</div>
    </div>
  );
};

export default Request;
