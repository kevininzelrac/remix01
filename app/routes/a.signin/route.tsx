import { Label, Input, Button } from "~/components";

export default function Component() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full md:w-1/2 p-8">
        <img
          alt="Sign In Illustration"
          className="object-cover w-full h-full rounded-lg shadow-md"
          height="500"
          src="/placeholder.svg"
          style={{
            aspectRatio: "500/500",
            objectFit: "cover",
          }}
          width="500"
        />
      </div>
      <div className="w-full md:w-1/2 p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter your information to sign in to your account
          </p>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" required type="password" />
          </div>
          <Button className="w-full" type="submit">
            Sign In
          </Button>
        </div>
        <div className="space-y-4">
          <p className="text-center text-gray-500 dark:text-gray-400">
            Or sign in with
          </p>
          <div className="flex space-x-4 justify-center">
            <Button className="w-1/3 bg-[#4285F4] text-white">Google</Button>
            <Button className="w-1/3 bg-[#333] text-white">GitHub</Button>
            <Button className="w-1/3 bg-[#3b5998] text-white">Facebook</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
