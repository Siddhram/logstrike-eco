"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>[0]

interface CarouselProps {
  opts?: UseCarouselParameters
  plugins?: UseEmblaCarouselType[2]
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
        align: "center",
        loop: true,
        dragFree: true,
      },
      plugins
    )

    React.useEffect(() => {
      if (emblaApi && setApi) {
        setApi(emblaApi)
      }
    }, [emblaApi, setApi])

    return (
      <div
        ref={ref}
        className={cn("relative w-full", className)}
        {...props}
      >
        <div
          ref={emblaRef}
          className="overflow-hidden rounded-lg"
        >
          <div className="flex -ml-4">
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex", className)}
    {...props}
  />
))
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    aria-roledescription="slide"
    className={cn(
      "min-w-0 pl-4 relative flex-none md:basis-1/2 lg:basis-1/3",
      className
    )}
    {...props}
  />
))
CarouselItem.displayName = "CarouselItem"

// Update the CarouselPrevious component to use ChevronLeftIcon
const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => (
  <Button
    ref={ref}
    variant={variant}
    size={size}
    className={cn(
      "absolute left-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full",
      className
    )}
    {...props}
  >
    <ChevronLeftIcon className="h-4 w-4" />
    <span className="sr-only">Previous slide</span>
  </Button>
))
CarouselPrevious.displayName = "CarouselPrevious"

// Update the CarouselNext component to use ChevronRightIcon
const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => (
  <Button
    ref={ref}
    variant={variant}
    size={size}
    className={cn(
      "absolute right-4 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full",
      className
    )}
    {...props}
  >
    <ChevronRightIcon className="h-4 w-4" />
    <span className="sr-only">Next slide</span>
  </Button>
))
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}