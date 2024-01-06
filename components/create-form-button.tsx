"use client";
import { BsFileEarmarkPlus } from 'react-icons/bs';
import { ImSpinner2 } from 'react-icons/im';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { toast } from './ui/use-toast';
import { FormSchemaType, formSchema } from '@/schemas/form';
import { createForm } from '@/actions/form';
import { useRouter } from 'next/navigation';

export default function CreateFormButton() {
  const router = useRouter();
  const form = useForm<FormSchemaType>({
    mode: "all",
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (values: FormSchemaType) => {
    try {
      const formId = await createForm(values);
      toast({
        title: "Success",
        description: "Form created successfully"
      });
      router.push(`/builder/${formId}`);
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong, please try again later",
        variant: "destructive"
      })
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='group border border-primary/20 h-[190px] flex flex-col items-center justify-center hover:border-primary hover:cursor-pointer border-dashed gap-4'>
          <BsFileEarmarkPlus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
          <p className='font-bold group-hover:text-primary text-xl text-muted-foreground'>Create new form</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Form</DialogTitle>
          <DialogDescription>
            Create a new form to start collecting responses
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4 py-4'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className='w-full mt-4'>
              {!form.formState.isSubmitting && (
                <span>Save</span>
              )}
              {form.formState.isSubmitting && (
                <ImSpinner2 className="animate-spin" />
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}