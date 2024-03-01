import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { AvatarInput } from "~/components";

const gridElements = [
  {
    id: "a",
    picture: "/placeholder.svg",
    title: "Mountain Majesty",
    description: "Majestic peaks against a clear blue sky",
  },
  {
    id: "b",
    picture: "/placeholder.svg",
    title: "Coastal Serenity",
    description: "Waves gently lapping on a tranquil shore",
  },
  {
    id: "c",
    picture: "/placeholder.svg",
    title: "Golden Sunset",
    description: "The sky ablaze with warm, glowing colors",
  },
  {
    id: "d",
    picture: "/placeholder.svg",
    title: "Tranquil Lake",
    description: "Mirror-like water reflecting the surrounding forest",
  },
  {
    id: "e",
    picture: "/placeholder.svg",
    title: "Enchanting Forest",
    description: "Sunlight filtering through the trees in a magical woodland",
  },
];

export default function Component() {
  return (
    <div>
      <div className="flex items-center space-x-4">
        <Select value="personal">
          <SelectTrigger>
            <SelectValue
              className="w-[200px]"
              placeholder="Switch portafolios"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="client">Client</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" variant="outline">
          New portafolio
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Personal information</CardTitle>
          <CardDescription>Modify your details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              defaultValue="Sebastian Garrido"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="avatar">Avatar</Label>
            <AvatarInput id="avatar" name="avatar" defaultValue="file.png" />
          </div>
        </CardContent>
      </Card>
      <section className="w-full py-12">
        <div className="container px-4 md:px-6 grid gap-6 md:gap-8">
          <div className="grid gap-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Add your pictures
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              People will be able to see your work!
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 items-start">
            {gridElements.map((item) => (
              <div key={item.id} className="flex flex-col items-start">
                <img
                  alt="Image 1"
                  className="rounded-lg object-cover aspect-square border"
                  height={300}
                  src={item.picture}
                  width={300}
                />
                <div className="grid gap-1 mt-2">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
