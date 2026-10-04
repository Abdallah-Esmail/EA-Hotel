/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE UNIQUE NONCLUSTERED INDEX UX_Bookings_User_Pending
      ON Bookings (user_id)
      WHERE status = 'pending';
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER trg_prevent_booking_overlap
      ON Bookings
      AFTER INSERT, UPDATE
      AS
      BEGIN
        SET NOCOUNT ON;

        IF EXISTS (
          SELECT 1
          FROM Bookings b
          INNER JOIN inserted i ON b.room_id = i.room_id AND b.id <> i.id
          WHERE b.status <> 'cancelled'
            AND i.status <> 'cancelled'
            AND i.check_in < b.check_out
            AND i.check_out > b.check_in
        )
        BEGIN
          RAISERROR (
            'The selected dates overlap with an existing active booking.',
            16,
            1
          );
          RETURN;
        END
      END;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      IF OBJECT_ID('trg_prevent_booking_overlap', 'TR') IS NOT NULL
        DROP TRIGGER trg_prevent_booking_overlap;
    `);

    await queryInterface.sequelize.query(`
      IF EXISTS (
        SELECT *
        FROM sys.indexes
        WHERE name = 'UX_Bookings_User_Pending'
          AND object_id = OBJECT_ID('Bookings')
      )
        DROP INDEX UX_Bookings_User_Pending ON Bookings;
    `);
  },
};
