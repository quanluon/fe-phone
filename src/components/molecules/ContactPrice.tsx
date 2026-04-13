import Link from "next/link";
import { Button } from "../ui";
import { CONTACT_INFO } from "@/lib/constants";
import { ShoppingCartIcon } from "lucide-react";

interface Props{
    label?: string;
}

export const ContactPrice = ({ label }: Props) => {
    return (
        <Button size="lg" variant="brand" asChild className="flex-1">
            <Link href={`tel:${CONTACT_INFO.phoneLink}`}>
                <ShoppingCartIcon className="h-4 w-4" />
                {label || "Liên hệ"}
            </Link>
        </Button>
    );
}