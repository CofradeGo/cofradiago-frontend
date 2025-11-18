import { render, screen } from "@testing-library/react";
import Button from "../atoms/Button";

describe("Button Component", () => {
  it("renders the button with correct text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
