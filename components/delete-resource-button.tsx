"use client";


import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import { ButtonHTMLAttributes, useState } from "react";

interface DeleteResourceButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  resourceId: string;
  resourceTitle: string;
}

export function DeleteResourceButton({
  resourceId,
  resourceTitle,
  ...props
}: DeleteResourceButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/resources/${resourceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete resource");
      }

      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting resource:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" {...props}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Resource</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{resourceTitle}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
