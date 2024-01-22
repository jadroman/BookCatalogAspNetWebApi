using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BookCatalog.DAL.Migrations
{
    public partial class bookCreatedAndChangedField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "TimeOfCreation",
                table: "Book",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TimeOfLastChange",
                table: "Book",
                type: "datetime2",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TimeOfCreation",
                table: "Book");

            migrationBuilder.DropColumn(
                name: "TimeOfLastChange",
                table: "Book");
        }
    }
}
