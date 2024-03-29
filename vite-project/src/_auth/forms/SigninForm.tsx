import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { SigninValidationSchema } from '@/lib/validation';
import Loader from '@/components/shared/Loader';
import { Link,useNavigate } from 'react-router-dom';
import {  useSignInAccount } from '@/lib/react-query/queriesAndMutations';
import { useUserContext } from '@/context/AuthContext';



const SigninForm = () => {
  //define your toast
  const { toast } = useToast();
  const {checkAuthUser, isLoading: isUserLoading} = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: SignInAccount,isPending } = useSignInAccount();

  //define your form
  const form = useForm<z.infer<typeof SigninValidationSchema>>({
    resolver: zodResolver(SigninValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  //define your submit handler
  const handleSignin = async (user: z.infer<typeof SigninValidationSchema>) => {

    console.log("I am here");
    const session = await SignInAccount(user)

    if(!session){
      console.log("I am here");
      return toast({
        title: "Sign in failed please try again"
      })
      
    }

    const isLoggedin = await checkAuthUser();

    if(isLoggedin){
      console.log("I am here");
      form.reset();
      navigate('/');
    }
    else{
      return toast({ title: "Sign up failed please try again"})
    }

  }

  return (
      <Form {...form}>
        <div className='sm:w-420 flex-center flex-col'>
          <img src='/assets/images/logo.svg' alt="logo" />
          <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log in to your accout</h2>
          <p className="text-light-3 small-medium md:base-regular">Welcome back! Please enter your details</p>

          <form onSubmit={form.handleSubmit(handleSignin)}   className="flex flex-col gap-5 w-full mt-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="shad-button_primary">
              {isUserLoading ? (
                <div className="flex-center gap-2 ">
                  <Loader/>  Loading...
                </div>
              ) : "Sign in" }
            </Button>
            <p className="text-small-regular text-light-2 text-center mt-2">
              Do not have an account? 
              <Link to="/sign-up" className='text-primary-500 text-small-semibold ml-1'>
                Sign-up
              </Link>
            </p>
          </form>
       </div>
     </Form>
  )
}

export default SigninForm