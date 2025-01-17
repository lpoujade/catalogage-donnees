import uuid
from typing import List, Optional

from sqlalchemy import Column, String, select
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession

from server.domain.common.types import ID, id_factory
from server.domain.tags.entities import Tag
from server.domain.tags.repositories import TagRepository
from server.infrastructure.database import Base, Database


class TagModel(Base):
    __tablename__ = "tag"

    id: uuid.UUID = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String, nullable=False)


def make_entity(instance: TagModel) -> Tag:
    return Tag(**{field: getattr(instance, field) for field in Tag.__fields__})


def make_instance(entity: Tag) -> TagModel:
    return TagModel(**entity.dict())


class SqlTagRepository(TagRepository):
    def __init__(self, db: Database) -> None:
        self._db = db

    def make_id(self) -> ID:
        return id_factory()

    async def get_all(self, *, ids: List[ID] = None) -> List[Tag]:
        async with self._db.session() as session:
            stmt = select(TagModel)
            if ids is not None:
                stmt = stmt.where(TagModel.id.in_(ids))
            result = await session.execute(stmt)
            return [make_entity(instance) for instance in result.scalars().all()]

    async def _maybe_get_by_id(
        self, session: AsyncSession, id_: ID
    ) -> Optional[TagModel]:
        stmt = select(TagModel).where(TagModel.id == id_)
        result = await session.execute(stmt)

        try:
            return result.scalar_one()
        except NoResultFound:
            return None

    async def get_by_id(self, id_: ID) -> Optional[Tag]:
        async with self._db.session() as session:
            instance = await self._maybe_get_by_id(session, id_)

            if instance is None:
                return None

            return make_entity(instance)

    async def insert(self, entity: Tag) -> ID:
        async with self._db.session() as session:
            instance = make_instance(entity)

            session.add(instance)

            await session.commit()
            await session.refresh(instance)

            return ID(instance.id)
