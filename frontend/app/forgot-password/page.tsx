"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    const emailOk = /.+@.+\..+/.test(email);
    if (!emailOk) {
      setError("Enter a valid email address");
      return;
    }
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSuccess("If an account exists for this email, a reset link has been sent.");
    }, 1500);
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h2 className="mb-6 text-2xl font-semibold">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
          />
        </div>
        {error && (
          <p className="text-sm text-destructive" role="alert">{error}</p>
        )}
        {success && (
          <p className="text-sm text-success" role="status">{success}</p>
        )}
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </div>
  );
}
