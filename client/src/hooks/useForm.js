import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const useCustomForm = (schema) => useForm({ resolver: zodResolver(schema) });
export default useCustomForm;
