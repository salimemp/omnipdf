import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../src/Card';

describe('Card', () => {
  test('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  test('renders with default variant', () => {
    render(<Card>Card</Card>);
    const card = screen.getByText('Card').closest('div');
    expect(card).toHaveClass('bg-white');
  });

  test('renders with bordered variant', () => {
    render(<Card variant="bordered">Card</Card>);
    const card = screen.getByText('Card').closest('div');
    expect(card).toHaveClass('border');
  });

  test('renders with elevated variant', () => {
    render(<Card variant="elevated">Card</Card>);
    const card = screen.getByText('Card').closest('div');
    expect(card).toHaveClass('shadow-medium');
  });

  test('applies hover effect when enabled', () => {
    render(<Card hover>Card</Card>);
    const card = screen.getByText('Card').closest('div');
    expect(card).toHaveClass('hover:-translate-y-0.5');
  });

  test('applies padding classes', () => {
    const { rerender } = render(<Card padding="none">Card</Card>);
    expect(screen.getByText('Card').closest('div')).not.toHaveClass('p-');
    
    rerender(<Card padding="sm">Card</Card>);
    expect(screen.getByText('Card').closest('div')).toHaveClass('p-3');
    
    rerender(<Card padding="md">Card</Card>);
    expect(screen.getByText('Card').closest('div')).toHaveClass('p-5');
    
    rerender(<Card padding="lg">Card</Card>);
    expect(screen.getByText('Card').closest('div')).toHaveClass('p-8');
  });

  test('applies custom className', () => {
    render(<Card className="custom-card">Card</Card>);
    const card = screen.getByText('Card').closest('div');
    expect(card).toHaveClass('custom-card');
  });
});

describe('CardHeader', () => {
  test('renders children', () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<CardHeader className="custom-header">Header</CardHeader>);
    const header = screen.getByText('Header').parentElement;
    expect(header).toHaveClass('custom-header');
  });
});

describe('CardTitle', () => {
  test('renders title text', () => {
    render(<CardTitle>My Card Title</CardTitle>);
    expect(screen.getByText('My Card Title')).toBeInTheDocument();
  });

  test('applies heading styles', () => {
    render(<CardTitle>Title</CardTitle>);
    const title = screen.getByText('Title');
    expect(title).toHaveClass('text-lg');
    expect(title).toHaveClass('font-semibold');
  });
});

describe('CardDescription', () => {
  test('renders description text', () => {
    render(<CardDescription>This is a description</CardDescription>);
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  test('applies description styles', () => {
    render(<CardDescription>Desc</CardDescription>);
    const desc = screen.getByText('Desc');
    expect(desc).toHaveClass('text-sm');
    expect(desc).toHaveClass('text-surface-500');
  });
});

describe('CardContent', () => {
  test('renders children', () => {
    render(<CardContent>Content area</CardContent>);
    expect(screen.getByText('Content area')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<CardContent className="custom-content">Content</CardContent>);
    const content = screen.getByText('Content').parentElement;
    expect(content).toHaveClass('custom-content');
  });
});

describe('CardFooter', () => {
  test('renders children', () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  test('applies footer styles', () => {
    render(<CardFooter>Footer</CardFooter>);
    const footer = screen.getByText('Footer').parentElement;
    expect(footer).toHaveClass('mt-4');
    expect(footer).toHaveClass('flex');
    expect(footer).toHaveClass('items-center');
  });

  test('applies custom className', () => {
    render(<CardFooter className="custom-footer">Footer</CardFooter>);
    const footer = screen.getByText('Footer').parentElement;
    expect(footer).toHaveClass('custom-footer');
  });
});

describe('Card Components Together', () => {
  test('renders complete card', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card description')).toBeInTheDocument();
    expect(screen.getByText('Card content goes here')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /action/i })).toBeInTheDocument();
  });
});
