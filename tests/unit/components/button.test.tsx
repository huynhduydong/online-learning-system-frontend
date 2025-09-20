import { render, screen } from "@testing-library/react"
import { Button } from "@/components/ui/button"

describe("Button Component", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole("button", { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it("applies variant classes correctly", () => {
    render(<Button variant="outline">Outline Button</Button>)

    const button = screen.getByRole("button", { name: /outline button/i })
    expect(button).toHaveClass("border", "border-input", "bg-background")
  })

  it("applies size classes correctly", () => {
    render(<Button size="lg">Large Button</Button>)

    const button = screen.getByRole("button", { name: /large button/i })
    expect(button).toHaveClass("h-11", "rounded-md", "px-8")
  })

  it("handles disabled state", () => {
    render(<Button disabled>Disabled Button</Button>)

    const button = screen.getByRole("button", { name: /disabled button/i })
    expect(button).toBeDisabled()
    expect(button).toHaveClass("disabled:pointer-events-none", "disabled:opacity-50")
  })
})
