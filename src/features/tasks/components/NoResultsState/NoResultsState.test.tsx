import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { useFilterStore } from '../../store/useFilterStore'
import { NoResultsState } from './NoResultsState'

describe('NoResultsState', () => {
  beforeEach(() => {
    useFilterStore.getState().clearFilters()
  })

  it('renders and clears filters', async () => {
    const user = userEvent.setup()
    useFilterStore.getState().setSearchInput('nothing')
    render(<NoResultsState />)
    expect(screen.getByTestId('no-results')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Clear all filters' }))
    expect(useFilterStore.getState().searchInput).toBe('')
  })
})
