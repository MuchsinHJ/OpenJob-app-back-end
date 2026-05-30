/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('jobs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    company_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"companies"',
      onDelete: 'CASCADE',
    },
    category_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"categories"',
      onDelete: 'SET NULL',
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    description: {
      type: 'TEXT',
    },
    job_type: {
      type: 'VARCHAR(50)',
    },
    experience_level: {
      type: 'VARCHAR(50)',
    },
    location_type: {
      type: 'VARCHAR(50)',
    },
    location_city: {
      type: 'VARCHAR(100)',
    },
    salary_min: {
      type: 'BIGINT',
    },
    salary_max: {
      type: 'BIGINT',
    },
    is_salary_visible: {
      type: 'BOOLEAN',
      default: true,
    },
    status: {
      type: 'VARCHAR(50)',
      default: 'open',
    },
    created_at: {
      type: 'TIMESTAMP',
      default: pgm.func('NOW()'),
    },
    updated_at: {
      type: 'TIMESTAMP',
      default: pgm.func('NOW()'),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('jobs');
};
