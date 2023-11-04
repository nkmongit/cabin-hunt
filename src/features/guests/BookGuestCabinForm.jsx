import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import Spinner from '../../ui/Spinner';
import './Guest.css';
import supabase from '../../services/supabase';
import { createBookingAPI } from '../../services/apiBookings';
import toast from 'react-hot-toast';

function BookGuestCabinForm() {
  const { register, formState, handleSubmit, reset } = useForm();
  const { errors } = formState;
  const { bookingId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const { isLoading: isLoadingCabins, data: cabins } = useQuery(
    ['cabins'],
    fetchCabins
  );
  const { isLoading: isLoadingGuests, data: guests } = useQuery(
    ['guests'],
    fetchGuests
  );

  useEffect(() => {
    fetchGuests();
    fetchCabins();
  }, []);

  async function fetchGuests() {
    try {
      const { data: guestsData, error } = await supabase
        .from('guests')
        .select('id, fullName');

      if (error) {
        console.error(error);
        throw new Error('Failed to fetch guests');
      }

      return guestsData;
    } catch (error) {
      console.error('Error fetching guests:', error);
      throw new Error('Failed to fetch guests');
    }
  }

  async function fetchCabins() {
    try {
      const { data: cabinsData, error } = await supabase
        .from('cabins')
        .select('id, name, isBooked, regularPrice');

      if (error) {
        console.error(error);
        throw new Error('Failed to fetch cabins');
      }

      return cabinsData;
    } catch (error) {
      console.error('Error fetching cabins:', error);
      throw new Error('Failed to fetch cabins');
    }
  }

  async function createBooking(formData) {
    try {
      const {
        guestId,
        cabinId,
        observations,
        isPaid,
        hasBreakfast,
        startDate,
        endDate,
        numGuests,
      } = formData;

      console.log(`${typeof guestId} guestID`);
      console.log(`${typeof cabinId} cabinID`);

      console.log('Guests: ', guests);
      const guest = guests.find((guest) => guest.id === parseInt(guestId));

      const cabin = cabins.find((cabin) => cabin.id === parseInt(cabinId));

      console.log(`${typeof guest.id} value of guest`);
      console.log(`${typeof cabin.id} value of cabin`);

      if (!guest || !cabin) {
        console.error('Invalid guest or cabin');
        return;
      }

      const cabinPrice = cabin.regularPrice;
      const numNights = calculateNumNights(startDate, endDate);
      const totalPrice = calculateTotalPrice(
        cabinPrice,
        numNights,
        hasBreakfast
      );
      const extrasPrice = calculateExtraPrice(numNights);
      // Placeholder functions, replace with your actual calculations
      function calculateNumNights(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Calculate the time difference in milliseconds
        const timeDiff = Math.abs(end - start);

        // Convert the time difference to days
        const numNights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        return numNights;
      }

      function calculateTotalPrice(cabinPrice, numNights, hasBreakfast) {
        let totalPrice = cabinPrice * numNights;

        // Add breakfast cost if selected
        if (hasBreakfast) {
          const breakfastPrice = 10; // Assuming breakfast price is $10 per day
          totalPrice += breakfastPrice * numNights;
        }

        return totalPrice;
      }
      function calculateExtraPrice(numNights) {
        // Implement your logic to calculate the extra price
        // based on the number of nights and any additional factors
        const extraPricePerNight = 20; // Assuming extra price is $20 per night
        const extraPrice = extraPricePerNight * numNights;

        return extraPrice;
      }

      const bookingData = {
        guestId: parseInt(guestId),
        cabinId: parseInt(cabinId),
        observations,
        isPaid,
        hasBreakfast,
        startDate,
        endDate,
        status: 'unconfirmed',
        numNights,
        totalPrice,
        cabinPrice,
        extrasPrice,
        numGuests,
      };

      const newBooking = await createBookingAPI(bookingData);

      console.log(newBooking);

      if (newBooking) {
        console.log('Booking created:', newBooking);
        toast.success('Successfully Booked');
        reset();
        navigate('/bookings');
      } else {
        console.error('Failed to create booking');
      }

      await supabase
        .from('cabins')
        .update({ isBooked: true })
        .eq('id', cabin.id);

      console.log('Cabin updated: isBooked = true');
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function onSubmit(formData) {
    createBooking(formData);
    reset();
  }

  if (isLoadingCabins || isLoadingGuests) {
    return <Spinner />;
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label='Guest' error={errors.guestId?.message}>
        <select
          id='guestId'
          {...register('guestId', { required: 'This field is required' })}
        >
          <option value=''>Select Guest</option>
          {guests &&
            guests.map((guest) => (
              <option key={guest.id} value={guest.id}>
                {guest.fullName}
              </option>
            ))}
        </select>
      </FormRow>

      <FormRow label='Cabin' error={errors.cabinId?.message}>
        <select
          id='cabinId'
          {...register('cabinId', { required: 'This field is required' })}
        >
          <option value='cabinId'>Select Cabin</option>
          {cabins &&
            cabins.map((cabin) => (
              <option key={cabin.id} value={cabin.id}>
                {cabin.name}
              </option>
            ))}
        </select>
      </FormRow>

      <FormRow label='Observations' error={errors.observations?.message}>
        <Input type='text' id='observations' {...register('observations')} />
      </FormRow>

      <FormRow label='Is Paid' error={errors.isPaid?.message}>
        <select
          id='isPaid'
          {...register('isPaid', { required: 'This field is required' })}
        >
          <option value='true'>Yes</option>
          <option value='false'>No</option>
        </select>
      </FormRow>

      <FormRow label='Number of Guests' error={errors.numGuests?.message}>
        <Input
          type='number'
          id='numGuests'
          disabled={isLoadingGuests}
          {...register('numGuests', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label='Has Breakfast' error={errors.hasBreakfast?.message}>
        <select
          id='hasBreakfast'
          {...register('hasBreakfast', { required: 'This field is required' })}
        >
          <option value='true'>Yes</option>
          <option value='false'>No</option>
        </select>
      </FormRow>

      <FormRow label='Start Date' error={errors.startDate?.message}>
        <Input
          type='date'
          id='startDate'
          {...register('startDate', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label='End Date' error={errors.endDate?.message}>
        <Input
          type='date'
          id='endDate'
          {...register('endDate', { required: 'This field is required' })}
        />
      </FormRow>

      <Button onSubmit={handleSubmit(onSubmit)} type='submit'>
        Create Booking
      </Button>
    </Form>
  );
}

export default BookGuestCabinForm;
