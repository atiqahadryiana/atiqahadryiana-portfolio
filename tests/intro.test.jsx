import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import IntroScreen from '../src/components/IntroScreen';

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});
describe('Ten-second portfolio introduction', () => {
  it('finishes after ten seconds and reports the actual remaining time', () => {
    vi.useFakeTimers();
    const done = vi.fn();
    render(<IntroScreen onComplete={done} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    act(() => vi.advanceTimersByTime(9000));
    expect(done).not.toHaveBeenCalled();
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuetext',
      '1 second until the portfolio opens',
    );
    act(() => vi.advanceTimersByTime(999));
    expect(done).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(done).toHaveBeenCalledTimes(1);
  });
  it('supports Escape and timer/scroll cleanup', () => {
    vi.useFakeTimers();
    const done = vi.fn();
    const initialOverflow = document.body.style.overflow;
    const view = render(<IntroScreen onComplete={done} />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(done).toHaveBeenCalledTimes(1);
    view.unmount();
    expect(document.body.style.overflow).toBe(initialOverflow);
    act(() => vi.advanceTimersByTime(10000));
    expect(done).toHaveBeenCalledTimes(1);
  });
});
