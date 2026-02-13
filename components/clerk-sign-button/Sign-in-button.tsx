import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

export const SignInButtonClerk = () => {
	return (
		<>
			<SignedOut>
				<SignInButton mode="modal">
					<Button>Get Started</Button>
				</SignInButton>
				{/* <SignUpButton mode="modal">
									<Button>Sign UP</Button>
								</SignUpButton> */}
			</SignedOut>

			<SignedIn>
				<UserButton />
			</SignedIn>
		</>
	);
};
