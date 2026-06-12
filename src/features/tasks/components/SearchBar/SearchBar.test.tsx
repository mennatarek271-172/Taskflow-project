import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { useFilterStore } from '../../store/useFilterStore'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  beforeEach(() => {
    useFilterStore.getState().clearFilters()
  })

  it('renders and updates search input', async () => {
    const user = userEvent.setup()
    render(<SearchBar />)
    const input = screen.getByTestId('task-search')
    await user.type(input, 'bug')
    expect(useFilterStore.getState().searchInput).toBe('bug')
  })
})
