import { render, screen } from "@testing-library/react";
import Card from "../molecules/Card";

describe("Card Component", () => {
  it("renders title and children content", () => {
    render(<Card title="Test Card">Hello World</Card>);
    expect(screen.getByText("Test Card")).toBeInTheDocument();
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
