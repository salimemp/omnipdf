import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../src/Input';

describe('Input', () => {
  test('renders input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  test('renders with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  test('shows helper text', () => {
    render(<Input helperText="Enter your email" />);
    expect(screen.getByText('Enter your email')).toBeInTheDocument();
  });

  test('shows error message', () => {
    render(<Input error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
  });

  test('renders with left icon', () => {
    render(<Input leftIcon={<span data-testid="icon">★</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  test('renders with right icon', () => {
    render(<Input rightIcon={<span data-testid="icon">★</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  test('applies left icon padding', () => {
    render(<Input leftIcon={<span>★</span>} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('pl-10');
  });

  test('applies right icon padding', () => {
    render(<Input rightIcon={<span>★</span>} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('pr-10');
  });

  test('calls onChange handler', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    render(<Input onChange={handleChange} />);
    await user.type(screen.getByRole('textbox'), 'test');
    
    expect(handleChange).toHaveBeenCalled();
  });

  test('accepts value', () => {
    render(<Input value="prefilled" readOnly />);
    expect(screen.getByRole('textbox')).toHaveValue('prefilled');
  });

  test('applies custom className', () => {
    render(<Input className="custom-input" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-input');
  });

  test('forwards ref', () => {
    const ref = jest.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  test('disables input', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  test('renders different types', () => {
    const { rerender } = render(<Input type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    
    rerender(<Input type="password" />);
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
  });
});

describe('Input States', () => {
  test('renders required input', () => {
    render(<Input required />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  test('renders with max length', () => {
    render(<Input maxLength={10} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '10');
  });

  test('renders with placeholder', () => {
    render(<Input placeholder="Enter your name" />);
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
  });

  test('renders with autoComplete', () => {
    render(<Input autoComplete="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'email');
  });
});
