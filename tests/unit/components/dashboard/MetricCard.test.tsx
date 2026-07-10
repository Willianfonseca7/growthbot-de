import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MetricCard } from "../../../../src/components/dashboard/MetricCard";

describe("MetricCard", () => {
  it("renders the metric label, value, and hint", () => {
    render(<MetricCard label="Tracked Clicks" value={12} hint="Captured via redirect tracking." />);

    expect(screen.getByText("Tracked Clicks")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Captured via redirect tracking.")).toBeInTheDocument();
  });
});
