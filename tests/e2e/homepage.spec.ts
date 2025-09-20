import { test, expect } from "@playwright/test"

test.describe("Homepage", () => {
  test("should display the main heading", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByRole("heading", { name: /học tập trực tuyến hiệu quả/i })).toBeVisible()
  })

  test("should have navigation links", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByRole("link", { name: /khóa học/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /giới thiệu/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /liên hệ/i })).toBeVisible()
  })

  test("should have call-to-action buttons", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByRole("button", { name: /khám phá khóa học/i })).toBeVisible()
    await expect(page.getByRole("button", { name: /dùng thử miễn phí/i })).toBeVisible()
  })

  test("should display feature cards", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByText(/video hd/i)).toBeVisible()
    await expect(page.getByText(/cộng đồng/i)).toBeVisible()
    await expect(page.getByText(/chứng chỉ/i)).toBeVisible()
    await expect(page.getByText(/theo dõi tiến độ/i)).toBeVisible()
  })
})
