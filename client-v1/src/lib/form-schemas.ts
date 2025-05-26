import { z } from 'zod';

export const enquireForm = z
	.object({
		FirstName: z.string().min(1, 'First name is required'),
		LastName: z.string().min(1, 'Last name is required'),
		Email: z.string().email('Invalid email address'),
		PhoneNumber: z.string().regex(/^(\+49|0)[1-9]\d{9,14}$/, 'Invalid phone number'),
		CompanyName: z.string().min(1, 'Company name is required'),
		OfficeAddress: z.string().min(1, 'Office address is required'),
		AnythingElse: z.string().optional(),
		DailyOfficeMeal: z.boolean().optional(),
		CorporateCatering: z.boolean().optional()
	})
	.refine(data => data.DailyOfficeMeal || data.CorporateCatering, {
		message: 'Please select at least one service',
		path: ['DailyOfficeMeal']
	});

export const createSignInForm = (company?: string) =>
	z.object({
		Email: z
			.string()
			.transform(val => (company ? `${val}@${company}.com` : val))
			.pipe(z.string().email('Invalid email address')),
		Password: z.string().min(8, 'Password must be at least 8 characters long')
	});

export const signInForm = z.object({
	Email: z.string().email('Invalid email address'),
	Password: z.string().min(8, 'Password must be at least 8 characters long')
});

export const createSignUpForm = (company?: string) =>
	z.object({
		Email: z.string().refine(val => !val.includes('@'), 'Please enter only the username part'),
		Password: z.string().min(8, 'Password must be at least 8 characters long'),
		TermsAndConditions: z.boolean().refine(val => val === true, {
			message: 'Please accept the terms and conditions',
			path: ['TermsAndConditions']
		})
	});

// Keep this for non-company sign ups
export const signUpForm = z.object({
	FirstName: z.string().min(1, 'First Name is required'),
	LastName: z.string().min(1, 'Last Name is required'),
	Email: z.string().email('Invalid email address'),
	Password: z.string().min(8, 'Password must be at least 8 characters long'),
	TermsAndConditions: z.boolean().refine(val => val === true, {
		message: 'Please accept the terms and conditions',
		path: ['TermsAndConditions']
	})
});

export const deliveryAddressForm = z.object({
	firstName: z.string().min(1, 'First Name is required'),
	lastName: z.string().min(1, 'Last Name is required'),
	email: z.string().email('Invalid email address'),
	phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters'),
	Address: z.any().refine(val => val !== '', {
		message: 'Address is required'
	}),
	companyName: z.string().min(1, 'Company name is required'),
	defaultAddress: z.boolean().optional()
});

export const accountForm = z.object({
	FirstName: z.string().min(1, 'First Name is required'),
	LastName: z.string().min(1, 'Last Name is required'),
	PhoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
	CompanyName: z.string().min(1, 'Company name is required')
});

export const forgotPasswordForm = z.object({
	Email: z.string().email('Invalid email address')
});

export const resetPasswordForm = z
	.object({
		newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
		confirmPassword: z.string().min(8, 'Password must be at least 8 characters long')
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: 'Passwords must match', // error message
		path: ['confirmPassword'] // path to the field
	});
