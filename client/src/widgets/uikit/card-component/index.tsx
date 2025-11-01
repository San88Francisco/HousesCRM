import React from 'react';
import {
  CardTitle,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/shared/ui/card';

export const CardComponent = () => {
  return (
    <div className="flex items-start gap-5">
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>test content for card</div>
          <div>test content for card</div>
        </CardContent>
        <CardFooter className="grid grid-rows-2 ">
          <div>Footer content</div>
          <CardDescription>Foter discription</CardDescription>
        </CardFooter>
      </Card>
      <Card className="w-1/3" variant="sky">
        <CardHeader>
          <CardTitle variant="sky">Card Title</CardTitle>
          <CardDescription variant="sky">Card Description</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4" variant="sky">
          <div>test content for card</div>
          <div>test content for card</div>
        </CardContent>
        <CardFooter className="grid grid-rows-2 " variant="sky">
          <div>Footer content</div>
          <CardDescription variant="sky">Foter discription</CardDescription>
        </CardFooter>
      </Card>

      <Card className="w-1/3" variant="purple">
        <CardHeader>
          <CardTitle variant="sky">Card Title</CardTitle>
          <CardDescription variant="sky">Card Description</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4" variant="sky">
          <div>test content for card</div>
          <div>test content for card</div>
        </CardContent>
        <CardFooter className="grid grid-rows-2 " variant="purple">
          <div>Footer content</div>
          <CardDescription variant="purple">Foter discription</CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
};
