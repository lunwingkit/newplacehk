"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { upsertEvent } from "@/lib/api";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
}

export default function EventModal({
  isOpen,
  onClose,
  event,
}: EventModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    price: "",
    capacity: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        price: event.price.toString(),
        capacity: event.capacity.toString(),
      });
    } else {
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        price: "",
        capacity: "",
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventData = {
        id: event?.id,
        ...formData,
        price: Number.parseFloat(formData.price),
        capacity: Number.parseInt(formData.capacity),
      };
      await upsertEvent(eventData);

      toast({
        title: event ? "Event updated" : "Event created",
        description: event
          ? "The event has been successfully updated."
          : "A new event has been successfully created.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the event. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {/* Form fields remain the same */}
          <div className="flex justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
