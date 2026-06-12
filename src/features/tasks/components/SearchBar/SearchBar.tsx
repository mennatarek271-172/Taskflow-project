import { motion } from 'framer-motion'
import { Input } from '@/shared/components/Input'
import { fadeVariants } from '@/shared/motion/variants'
import { useFilterStore } from '../../store/useFilterStore'

export function SearchBar() {
  const searchInput = useFilterStore((s) => s.searchInput)
  const setSearchInput = useFilterStore((s) => s.setSearchInput)

  return (
    <motion.div variants={fadeVariants} initial="hidden" animate="visible" className="flex-1">
      <Input
        type="search"
        placeholder="Search tasks by title, description, or assignee..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        aria-label="Search tasks"
        data-testid="task-search"
      />
    </motion.div>
  )
}
