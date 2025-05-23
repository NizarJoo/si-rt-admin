import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CardOverview({ title, value, description, Icon }) {
  return (
    <Card className="p-4 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {Icon && <Icon className="w-8 h-8 text-primary" />}
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm ">{description}</p>
      </CardContent>
    </Card>
  );
}
