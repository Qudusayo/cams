import { z } from "zod";

export const FormSchema = z.object({
  fullname: z.string().min(2, {
    message: "Enter your full name with surname first.",
  }),
  staffId: z.string().min(2, {
    message: "StaffId is required.",
  }),
  department: z.string({
    required_error: "Department is required.",
  }),
  departmentCode: z.string().min(2, {
    message: "(Check on your pay slip)",
  }),
  unit: z.string().min(2, {
    message: "Unit is required.",
  }),
  dateOfBirth: z.date({
    required_error: "A date of birth is required.",
  }),
  dateOfFirstAppointment: z.date({
    required_error: "A date of first appointment is required.",
  }),
  appointmentConfirmed: z.boolean(),
  salaryPerAnnum: z.string({
    required_error: "Salary per annum is required.",
  }),
  conuass: z.string({
    required_error: "CONUASS/CONTISS is required.",
  }),
  amount: z.string({
    required_error: "Amount is required.",
  }),
  dateToRetireAdvance: z.date({
    required_error: "Date to retire advance is required.",
  }),
  purpose: z.string().min(10, {
    message:
      "Purpose for which advance is required and at least 10 characters.",
  }),
});
