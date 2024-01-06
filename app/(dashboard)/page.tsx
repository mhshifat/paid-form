import { LuView } from 'react-icons/lu';
import { FaWpforms, FaEdit } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
import { BiRightArrowAlt } from 'react-icons/bi';
import { TbArrowBounce } from 'react-icons/tb';
import { getFormStats, getForms } from "@/actions/form"
import { ReactElement, ReactNode, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import CreateFormButton from '@/components/create-form-button';
import { Form } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { formatDistance } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container pt-4">
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
      <Separator className='my-6' />
      <h2 className='text-4xl font-bold col-span-2'>Your Forms</h2>
      <Separator className='my-6' />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <CreateFormButton />
        <Suspense fallback={[1, 2, 3, 4].map(key => <FormCardSkeleton key={key} />)}>
          <FormCards />
        </Suspense>
      </div>
    </div>
  )
}

async function CardStatsWrapper() {
  const stats = await getFormStats();
  return <StatsCards loading={false} data={stats} />
}

interface StatsCardsProps {
  data?: Awaited<ReturnType<typeof getFormStats>>;
  loading: boolean;
}

function StatsCards({ data, loading }: StatsCardsProps) {
  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Visits"
        icon={<LuView className="text-blue-600" />}
        helperText="All time form visits"
        value={data?.visits.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-blue-600"
      />
      <StatsCard
        title="Total Submissions"
        icon={<FaWpforms className="text-yellow-600" />}
        helperText="All time form submissions"
        value={data?.submissions.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-yellow-600"
      />
      <StatsCard
        title="Submission Rate"
        icon={<HiCursorClick className="text-green-600" />}
        helperText="Visits that result in form submissions"
        value={(data?.submissionRate.toLocaleString() || "") + "%"}
        loading={loading}
        className="shadow-md shadow-green-600"
      />
      <StatsCard
        title="Bounce Rate"
        icon={<TbArrowBounce className="text-red-600" />}
        helperText="Visits that leaves without interacting"
        value={(data?.submissionRate.toLocaleString() || "") + "%"}
        loading={loading}
        className="shadow-md shadow-red-600"
      />
    </div>
  )
}

interface StatsCardProps {
  title: string;
  icon: ReactNode;
  helperText: string;
  value: string;
  loading: boolean;
  className: string;
}

function StatsCard({
  title,
  icon,
  helperText,
  value,
  loading,
  className
}: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className='flex flex-row justify-between items-center pb-2'>
        <CardTitle className='text-sm font-medium text-muted-foreground'>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>
          {loading && (
            <Skeleton>
              <span className='opacity-0'>0</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className='text-xs text-muted-foreground pt-1'>{helperText}</p>
      </CardContent>
    </Card>
  )
}

function FormCardSkeleton() {
  return <Skeleton className='border-2 border-primary/20 h-[190px] w-full' />
}

async function FormCards() {
  const forms = await getForms();

  return (
    <>
      {forms.map(form => (
        <FormCard key={form.id} form={form} />
      ))}
    </>
  )
}

interface FormCardProps {
  form: Form;
}

function FormCard({ form }: FormCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center justify-between gap-2'>
          <span className='truncate font-bold'>{form.name}</span>
          {form.published && (
            <Badge>Published</Badge>
          )}
          {!form.published && (
            <Badge variant='destructive'>Draft</Badge>
          )}
        </CardTitle>
        <CardDescription className='flex items-center justify-between text-muted-foreground text-sm'>
          {formatDistance(form.createdAt, new Date(), {
            addSuffix: true
          })}
          {form.published && (
            <span className='flex items-center gap-2'>
              <LuView className="text-muted-foreground" />
              <span>{form.visits.toLocaleString()}</span>
              <FaWpforms className="text-muted-foreground" />
              <span>{form.submissions.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className='h-[20px] truncate text-sm text-muted-foreground'>
        {form.description || "No description"}
      </CardContent>
      <CardFooter>
        {form.published && (
          <Button asChild className='w-full mt-2 text-md gap-4'>
            <Link href={`/forms/${form.id}`}>
              View Submissions <BiRightArrowAlt />
            </Link>
          </Button>
        )}
        {!form.published && (
          <Button variant="secondary" asChild className='w-full mt-2 text-md gap-4'>
            <Link href={`/builder/${form.id}`}>
              Edit Form <FaEdit />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}