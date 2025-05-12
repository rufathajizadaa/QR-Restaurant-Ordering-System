export const menuItems = [
  // Burgers
  {
    id: 1,
    name: "Classic Cheeseburger",
    description:
      "Juicy beef patty with melted cheddar cheese, lettuce, tomato, and our special sauce on a toasted bun.",
    category: "Burgers",
    price: 8.99,
    image: "/placeholder.svg?height=100&width=100",
    ingredients: ["Lettuce", "Tomato", "Pickles", "Onions", "Special Sauce"],
  },
  {
    id: 2,
    name: "Double Bacon Burger",
    description: "Two beef patties with crispy bacon, American cheese, pickles, and BBQ sauce.",
    category: "Burgers",
    price: 12.99,
    image: "/placeholder.svg?height=100&width=100",
    ingredients: ["Pickles", "Onions", "BBQ Sauce"],
  },
  {
    id: 3,
    name: "Veggie Burger",
    description: "Plant-based patty with avocado, sprouts, tomato, and vegan mayo on a whole grain bun.",
    category: "Burgers",
    price: 9.99,
    image: "/placeholder.svg?height=100&width=100",
    ingredients: ["Sprouts", "Tomato", "Vegan Mayo"],
  },

  // Sides
  {
    id: 4,
    name: "French Fries",
    description: "Crispy golden fries seasoned with sea salt.",
    category: "Sides",
    price: 3.99,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 5,
    name: "Onion Rings",
    description: "Crispy battered onion rings served with dipping sauce.",
    category: "Sides",
    price: 4.99,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 6,
    name: "Sweet Potato Fries",
    description: "Crispy sweet potato fries with a hint of cinnamon.",
    category: "Sides",
    price: 4.99,
    image: "/placeholder.svg?height=100&width=100",
  },

  // Beverages
  {
    id: 7,
    name: "Soft Drink",
    description: "Your choice of cola, lemon-lime, or orange soda.",
    category: "Beverages",
    price: 2.49,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 8,
    name: "Milkshake",
    description: "Creamy milkshake available in chocolate, vanilla, or strawberry.",
    category: "Beverages",
    price: 5.99,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 9,
    name: "Iced Tea",
    description: "Refreshing iced tea, sweetened or unsweetened.",
    category: "Beverages",
    price: 2.99,
    image: "/placeholder.svg?height=100&width=100",
  },

  // Desserts
  {
    id: 10,
    name: "Chocolate Brownie",
    description: "Warm chocolate brownie topped with vanilla ice cream and chocolate sauce.",
    category: "Desserts",
    price: 6.99,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 11,
    name: "Apple Pie",
    description: "Homemade apple pie with a flaky crust, served warm.",
    category: "Desserts",
    price: 5.99,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 12,
    name: "Ice Cream Sundae",
    description: "Three scoops of ice cream with your choice of toppings.",
    category: "Desserts",
    price: 4.99,
    image: "/placeholder.svg?height=100&width=100",
  },

  // Salads
  {
    id: 13,
    name: "Caesar Salad",
    description: "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan cheese.",
    category: "Salads",
    price: 7.99,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 14,
    name: "Greek Salad",
    description: "Mixed greens with feta cheese, olives, tomatoes, and cucumber with olive oil dressing.",
    category: "Salads",
    price: 8.99,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 15,
    name: "Chicken Salad",
    description: "Grilled chicken breast on a bed of mixed greens with avocado and honey mustard dressing.",
    category: "Salads",
    price: 10.99,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export const getCategories = () => {
  const categories = new Set(menuItems.map((item) => item.category))
  return Array.from(categories)
}

export const getItemsByCategory = (category) => {
  return menuItems.filter((item) => item.category === category)
}

export const getItemById = (id) => {
  return menuItems.find((item) => item.id === id)
}
