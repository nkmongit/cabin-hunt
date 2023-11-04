import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';
import { useGuest } from './useGuest';
import './Guest.css';

function AddGuestsForm() {
  const { addguest, isLoading } = useGuest();
  const { register, formState, handleSubmit, reset } = useForm();
  const { errors } = formState;

  const [nationalityOptions, setNationalityOptions] = useState([]);
  const [selectedNationality, setSelectedNationality] = useState(null);
  const [countryFlag, setCountryFlag] = useState('');

  useEffect(() => {
    // Fetch nationality options from API or define them manually
    const fetchedNationalities = [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
      { value: 'gb', label: 'United Kingdom' },
      { value: 'fr', label: 'France' },
      { value: 'de', label: 'Germany' },
      { value: 'au', label: 'Australia' },
      { value: 'br', label: 'Brazil' },
      { value: 'cn', label: 'China' },
      { value: 'jp', label: 'Japan' },
      { value: 'mx', label: 'Mexico' },
      { value: 'es', label: 'Spain' },
      { value: 'it', label: 'Italy' },
      { value: 'in', label: 'India' },
      { value: 'ru', label: 'Russia' },
      { value: 'sa', label: 'Saudi Arabia' },
      { value: 'za', label: 'South Africa' },
      { value: 'ar', label: 'Argentina' },
      { value: 'ch', label: 'Switzerland' },
      { value: 'se', label: 'Sweden' },
      { value: 'no', label: 'Norway' },
      { value: 'fi', label: 'Finland' },
      { value: 'dk', label: 'Denmark' },
      { value: 'nl', label: 'Netherlands' },
      { value: 'be', label: 'Belgium' },
      { value: 'pt', label: 'Portugal' },
      { value: 'pl', label: 'Poland' },
      { value: 'tr', label: 'Turkey' },
      { value: 'gr', label: 'Greece' },
      { value: 'kr', label: 'South Korea' },
      { value: 'th', label: 'Thailand' },
    ];

    setNationalityOptions(fetchedNationalities);
  }, []);

  function handleNationalityChange(selectedOption) {
    setSelectedNationality(selectedOption);
    setCountryFlag(`https://flagcdn.com/${selectedOption.value}.svg`);
  }

  async function onSubmit({ fullName, email, nationalID, phone }) {
    try {
      // Add the guest
      await addguest({
        fullName,
        email,
        nationalID,
        phone,
        nationality: selectedNationality?.value || '',
        countryFlag,
      });

      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label='Full name' error={errors?.fullName?.message}>
        <Input
          type='text'
          id='fullName'
          disabled={isLoading}
          {...register('fullName', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label='Email address' error={errors?.email?.message}>
        <Input
          type='email'
          id='email'
          disabled={isLoading}
          {...register('email', {
            required: 'This field is required',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Please provide a valid email address',
            },
          })}
        />
      </FormRow>

      <FormRow label='National ID' error={errors?.nationalID?.message}>
        <Input
          type='text'
          id='nationalID'
          disabled={isLoading}
          {...register('nationalID', {
            required: 'This field is required',
            minLength: {
              value: 8,
              message: 'Minimum Length for National ID is 8',
            },
          })}
        />
      </FormRow>

      <FormRow label='Nationality' error={errors?.nationality?.message}>
        <Select
          id='nationality'
          options={nationalityOptions}
          value={selectedNationality}
          onChange={handleNationalityChange}
          isDisabled={isLoading}
          placeholder='Select nationality...'
        />
      </FormRow>

      <FormRow label='Phone Number' error={errors?.phoneNumber?.message}>
        <Input
          type='tel'
          id='phone'
          disabled={isLoading}
          {...register('phone', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      {selectedNationality && (
        <FormRow label='Country Flag'>
          <img
            src={`https://flagcdn.com/${selectedNationality.value}.svg`}
            alt={`${selectedNationality.label} Flag`}
            style={{ height: '20px' }}
          />
        </FormRow>
      )}

      <FormRow>
        <Button
          variation='secondary'
          type='reset'
          disabled={isLoading}
          onClick={reset}
        >
          Cancel
        </Button>
        <Button disabled={isLoading}>Add Guest</Button>
      </FormRow>
    </Form>
  );
}

export default AddGuestsForm;
